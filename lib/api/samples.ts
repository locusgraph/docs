/**
 * The request, in four languages, built from whatever is in the playground.
 *
 * One function per language over the same input, so a reader switching tabs is
 * looking at the same call rather than four samples that drifted apart. The
 * body is the caller's, edited in the panel: a sample that cannot change is a
 * screenshot, and a reader has no way to see what their own question looks like
 * going over the wire.
 */
import { API_BASE, API_KEY_ENV, API_KEY_HEADER, type Endpoint } from "./endpoints";

export const LANGS = ["curl", "node", "python", "go"] as const;
export type SampleLang = (typeof LANGS)[number];

export const LANG_LABEL: Record<SampleLang, string> = {
  curl: "cURL",
  node: "Node",
  python: "Python",
  go: "Go",
};

/** Kept for the copy that names one host; a sample reads it per endpoint. */
export const BASE_URL = API_BASE.locusgraph;

/** The path with `:params` filled from the body, and those keys taken out. */
function resolve(endpoint: Endpoint, body: Record<string, unknown>) {
  const rest: Record<string, unknown> = { ...body };
  const path = endpoint.path.replace(/:([a-z_]+)/g, (whole, key: string) => {
    const value = rest[key];
    if (value === undefined || value === "") return whole;
    delete rest[key];
    return String(value);
  });
  return { path, rest };
}

/**
 * The one request both halves of the panel describe.
 *
 * `sampleFor` prints it and the Send button performs it, from this function, so
 * the code a reader copies is the call the playground just made. A GET carries
 * what is left of the body as a query string, because that is where those
 * fields go on the wire: building the query only in the sample would print a
 * url the button does not use.
 */
export interface BuiltRequest {
  readonly url: string;
  readonly method: Endpoint["method"];
  /** Present only for a method that takes one. */
  readonly payload?: Record<string, unknown>;
  /**
   * File parts by field, each the name of the file to send. Present only for
   * an endpoint that takes a file, and then the body is `multipart/form-data`:
   * `payload` holds the other parts as text rather than going over as JSON.
   */
  readonly files?: Record<string, string>;
}

/** The fields an endpoint takes as files, which only a multipart body can carry. */
export function fileFields(endpoint: Endpoint): string[] {
  return endpoint.params.filter((p) => p.field === "file").map((p) => p.name);
}

export function requestFor(endpoint: Endpoint, body: Record<string, unknown>): BuiltRequest {
  const { path, rest } = resolve(endpoint, body);

  const named = fileFields(endpoint);
  if (named.length > 0) {
    const files: Record<string, string> = {};
    const parts: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) {
      if (named.includes(k)) files[k] = String(v);
      else parts[k] = v;
    }
    return {
      url: `${API_BASE[endpoint.product]}${path}`,
      method: endpoint.method,
      payload: parts,
      files,
    };
  }

  // A DELETE with fields left over after the path carries them as JSON, the
  // way `unlink-two-contexts` reads them. Sent as a query, it answered `400
  // body must be valid JSON`, from the sample and the Send button alike. One
  // whose fields all went into the path still sends no body at all.
  const hasBody =
    endpoint.method === "DELETE" ? Object.keys(rest).length > 0 : endpoint.method !== "GET";

  const query = hasBody
    ? ""
    : Object.entries(rest)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(
              typeof v === "object" ? JSON.stringify(v) : String(v)
            )}`
        )
        .join("&");

  return {
    url: `${API_BASE[endpoint.product]}${path}${query ? `?${query}` : ""}`,
    method: endpoint.method,
    payload: hasBody ? rest : undefined,
  };
}

const json = (value: unknown, indent: number) =>
  JSON.stringify(value, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : " ".repeat(indent) + line))
    .join("\n");

export function sampleFor(
  endpoint: Endpoint,
  body: Record<string, unknown>,
  lang: SampleLang
): string {
  const { url, payload: sent, files } = requestFor(endpoint, body);
  const keyEnv = API_KEY_ENV[endpoint.product];
  const header = API_KEY_HEADER[endpoint.product] ?? API_KEY_HEADER.locusgraph;
  if (files) return multipartSample(endpoint, url, sent ?? {}, files, lang);
  const hasBody = sent !== undefined;
  const payload = sent ?? {};

  if (lang === "curl") {
    const lines = [
      `curl -X ${endpoint.method} ${url} \\`,
      `  -H "${header.name}: ${header.value(`$${keyEnv}`)}"${hasBody ? " \\" : ""}`,
    ];
    if (hasBody) {
      lines.push(`  -H "Content-Type: application/json" \\`, `  -d '${json(payload, 2)}'`);
    }
    return lines.join("\n");
  }

  if (lang === "node") {
    return [
      `const res = await fetch("${url}", {`,
      `  method: "${endpoint.method}",`,
      `  headers: {`,
      `    "${header.name}": \`${header.value(`\${process.env.${keyEnv}}`)}\`,`,
      ...(hasBody ? [`    "Content-Type": "application/json",`] : []),
      `  },`,
      ...(hasBody ? [`  body: JSON.stringify(${json(payload, 2)}),`] : []),
      `});`,
      ``,
      `const data = await res.json();`,
    ].join("\n");
  }

  if (lang === "python") {
    return [
      `import os`,
      `import requests`,
      ``,
      `res = requests.${endpoint.method.toLowerCase()}(`,
      `    "${url}",`,
      `    headers={"${header.name}": f"${header.value(`{os.environ['${keyEnv}']}`)}"},`,
      ...(hasBody ? [`    json=${json(payload, 4)},`] : []),
      `)`,
      ``,
      `print(res.json())`,
    ].join("\n");
  }

  return [
    ...(hasBody ? [`body, _ := json.Marshal(${json(payload, 0)})`, ``] : []),
    `req, _ := http.NewRequest(http.Method${endpoint.method[0]}${endpoint.method.slice(1).toLowerCase()},`,
    `    "${url}",`,
    hasBody ? `    bytes.NewReader(body))` : `    nil)`,
    `req.Header.Set("${header.name}",`,
    `    ${header.name === "Authorization" ? `"Bearer "+os.Getenv("${keyEnv}")` : `os.Getenv("${keyEnv}")`})`,
    ``,
    `res, err := http.DefaultClient.Do(req)`,
  ].join("\n");
}

/**
 * The same call for an endpoint that takes a file.
 *
 * A JSON body cannot carry one, so the sample builds a form instead, each
 * language its own way, and reads the file from disk by the name in the field.
 * Printing JSON here is what made `ingest-a-document` answer `400 Invalid
 * multipart body` to every reader who copied it.
 */
function multipartSample(
  endpoint: Endpoint,
  url: string,
  parts: Record<string, unknown>,
  files: Record<string, string>,
  lang: SampleLang
): string {
  const keyEnv = API_KEY_ENV[endpoint.product];
  const header = API_KEY_HEADER[endpoint.product] ?? API_KEY_HEADER.locusgraph;
  const text = Object.entries(parts).map(([k, v]) => [k, String(v)] as const);
  const file = Object.entries(files);

  if (lang === "curl") {
    return [
      `curl -X ${endpoint.method} ${url} \\`,
      `  -H "${header.name}: ${header.value(`$${keyEnv}`)}" \\`,
      ...[...file.map(([k, name]) => `${k}=@${name}`), ...text.map(([k, v]) => `${k}=${v}`)].map(
        (part, i, all) => `  -F "${part}"${i < all.length - 1 ? " \\" : ""}`
      ),
    ].join("\n");
  }

  if (lang === "node") {
    return [
      `import { openAsBlob } from "node:fs";`,
      ``,
      `const form = new FormData();`,
      ...file.map(([k, name]) => `form.append("${k}", await openAsBlob("${name}"), "${name}");`),
      ...text.map(([k, v]) => `form.append("${k}", "${v}");`),
      ``,
      `const res = await fetch("${url}", {`,
      `  method: "${endpoint.method}",`,
      `  headers: { "${header.name}": \`${header.value(`\${process.env.${keyEnv}}`)}\` },`,
      `  body: form,`,
      `});`,
      ``,
      `const data = await res.json();`,
    ].join("\n");
  }

  if (lang === "python") {
    return [
      `import os`,
      `import requests`,
      ``,
      `res = requests.${endpoint.method.toLowerCase()}(`,
      `    "${url}",`,
      `    headers={"${header.name}": f"${header.value(`{os.environ['${keyEnv}']}`)}"},`,
      `    files={${file.map(([k, name]) => `"${k}": open("${name}", "rb")`).join(", ")}},`,
      ...(text.length > 0
        ? [`    data={${text.map(([k, v]) => `"${k}": "${v}"`).join(", ")}},`]
        : []),
      `)`,
      ``,
      `print(res.json())`,
    ].join("\n");
  }

  return [
    `var body bytes.Buffer`,
    `form := multipart.NewWriter(&body)`,
    ...file.flatMap(([k, name]) => [
      `part, _ := form.CreateFormFile("${k}", "${name}")`,
      `file, _ := os.Open("${name}")`,
      `io.Copy(part, file)`,
    ]),
    ...text.map(([k, v]) => `form.WriteField("${k}", "${v}")`),
    `form.Close()`,
    ``,
    `req, _ := http.NewRequest(http.Method${endpoint.method[0]}${endpoint.method.slice(1).toLowerCase()},`,
    `    "${url}",`,
    `    &body)`,
    `req.Header.Set("Content-Type", form.FormDataContentType())`,
    `req.Header.Set("${header.name}",`,
    `    ${header.name === "Authorization" ? `"Bearer "+os.Getenv("${keyEnv}")` : `os.Getenv("${keyEnv}")`})`,
    ``,
    `res, err := http.DefaultClient.Do(req)`,
  ].join("\n");
}
