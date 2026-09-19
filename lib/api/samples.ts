/**
 * The request, in four languages, built from whatever is in the playground.
 *
 * One function per language over the same input, so a reader switching tabs is
 * looking at the same call rather than four samples that drifted apart. The
 * body is the caller's, edited in the panel: a sample that cannot change is a
 * screenshot, and a reader has no way to see what their own question looks like
 * going over the wire.
 */
import { API_BASE, API_KEY_ENV, type Endpoint } from "./endpoints";

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
  const { path, rest } = resolve(endpoint, body);
  const url = `${API_BASE[endpoint.product]}${path}`;
  const keyEnv = API_KEY_ENV[endpoint.product];
  const hasBody = endpoint.method !== "GET" && endpoint.method !== "DELETE";
  const payload = hasBody ? rest : {};

  if (lang === "curl") {
    const lines = [
      `curl -X ${endpoint.method} ${url} \\`,
      `  -H "Authorization: Bearer $${keyEnv}"${hasBody ? " \\" : ""}`,
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
      `    Authorization: \`Bearer \${process.env.${keyEnv}}\`,`,
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
      `    headers={"Authorization": f"Bearer {os.environ['${keyEnv}']}"},`,
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
    `req.Header.Set("Authorization",`,
    `    "Bearer "+os.Getenv("${keyEnv}"))`,
    ``,
    `res, err := http.DefaultClient.Do(req)`,
  ].join("\n");
}
