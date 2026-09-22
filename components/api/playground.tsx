"use client";

import { useEffect, useState } from "react";
import type { Endpoint } from "@/lib/api/endpoints";
import { API_BASE } from "@/lib/api/endpoints";
import { highlight, type Lang } from "@/lib/api/highlight";
import { LANG_LABEL, LANGS, requestFor, type SampleLang, sampleFor } from "@/lib/api/samples";

/**
 * The key is kept in this browser and nowhere else.
 *
 * The request goes from the reader's browser straight to the API, so a key
 * pasted here is a key in a browser and the copy says so. Proxying through this
 * host would hide it from the address bar and put other people's credentials on
 * the docs server, which is worse: this host would then be worth attacking.
 */
const keyStore = (product: string) => `${product}.playground.key`;

interface Result {
  readonly status: number;
  readonly ok: boolean;
  readonly body: string;
  readonly headers: string;
}

/** Pretty when it is JSON, untouched when it is not. */
function readable(text: string) {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text || "(empty body)";
  }
}

/**
 * The headers this page is allowed to see.
 *
 * A cross origin response hands JavaScript the safelisted headers plus
 * whatever the API names in `Access-Control-Expose-Headers`, so the rate limit
 * counters show up here only if the API exposes them. Saying that is better
 * than printing a fixed list that looks like it came off the wire.
 */
function visibleHeaders(res: Response) {
  const lines: string[] = [];
  res.headers.forEach((value, name) => lines.push(`${name}: ${value}`));
  return lines.length > 0
    ? lines.sort().join("\n")
    : "The API exposes no headers to this page. Run the sample above to see them all.";
}

function Code({ text, lang }: { text: string; lang: Lang }) {
  return (
    <pre className="m-0 overflow-x-auto p-3.5 font-mono text-[12px] leading-relaxed">
      {highlight(text, lang).map((token, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a token's position is its identity, and the list is rebuilt whole on every change
        <span key={i} style={{ color: token.colour }}>
          {token.text}
        </span>
      ))}
    </pre>
  );
}

export function Playground({ endpoint }: { endpoint: Endpoint }) {
  const [apiKey, setApiKey] = useState("");
  const [lang, setLang] = useState<SampleLang>("curl");
  const [body, setBody] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(endpoint.sample).map(([k, v]) => [
        k,
        typeof v === "object" ? JSON.stringify(v) : String(v),
      ])
    )
  );
  const [tab, setTab] = useState<"body" | "headers">("body");

  /**
   * What came back, or why nothing did.
   *
   * `sent` used to be a boolean that swapped in the response recorded in
   * `endpoints.json`, which meant the button printed a 200 whatever the API
   * would have answered. It performs the call now, so the panel holds the real
   * status, the headers the browser will let it read, and the body as sent.
   */
  const [result, setResult] = useState<Result | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const forget = () => {
    setResult(null);
    setFailure(null);
  };

  /**
   * Reading it on mount, not during render: the server has no localStorage, so
   * seeding state from it directly makes the first client render disagree with
   * the HTML and React throws the whole tree away.
   */
  useEffect(() => {
    try {
      setApiKey(window.localStorage.getItem(keyStore(endpoint.product)) ?? "");
    } catch {
      // A private window, or storage the browser refuses. The field still works
      // for this page; it simply will not be remembered.
    }
  }, [endpoint.product]);

  const remember = (value: string) => {
    setApiKey(value);
    forget();
    try {
      if (value) window.localStorage.setItem(keyStore(endpoint.product), value);
      else window.localStorage.removeItem(keyStore(endpoint.product));
    } catch {
      // As above. Losing the convenience is not worth failing the input.
    }
  };

  /**
   * What the field holds, as the type the API expects.
   *
   * A number stays a number and an object stays an object: `payload` is a JSON
   * object on the wire, and leaving it a string put `"payload": "{\"data\": …}"`
   * in every sample, which is a quoted string the API would reject. A value
   * mid-edit will not parse, and then it goes over as text rather than throwing
   * the sample away while someone is still typing.
   */
  const parsed: Record<string, unknown> = Object.fromEntries(
    Object.entries(body)
      .filter(([, v]) => v !== "")
      .map(([k, v]) => {
        if (/^-?\d+$/.test(v)) return [k, Number(v)];
        if (/^\s*[[{]/.test(v)) {
          try {
            return [k, JSON.parse(v)];
          } catch {
            return [k, v];
          }
        }
        return [k, v];
      })
  );

  const code = sampleFor(endpoint, parsed, lang);
  const hasKey = apiKey.trim().length > 0;

  const send = async () => {
    const request = requestFor(endpoint, parsed);
    setPending(true);
    setResult(null);
    setFailure(null);

    try {
      const res = await fetch(request.url, {
        method: request.method,
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          ...(request.payload ? { "Content-Type": "application/json" } : {}),
        },
        body: request.payload ? JSON.stringify(request.payload) : undefined,
      });

      setResult({
        status: res.status,
        ok: res.ok,
        body: readable(await res.text()),
        headers: visibleHeaders(res),
      });
    } catch {
      /**
       * A fetch that throws rather than answering never reached the API, or
       * reached it and the browser refused the answer. The usual cause is the
       * API not returning `Access-Control-Allow-Origin` for this host, and no
       * detail of it is readable from here, so the message says where to look
       * rather than guessing.
       */
      setFailure(
        `The browser blocked this call before any answer arrived. That is normally CORS: ${
          API_BASE[endpoint.product]?.replace("https://", "") ?? "the API"
        } has to return Access-Control-Allow-Origin for ${
          typeof window === "undefined" ? "this host" : window.location.origin
        }. The sample above still works from a terminal.`
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex items-center gap-2 rounded-lg border bg-surface px-3 py-2.5 ${
          hasKey ? "border-line" : "border-s2/60"
        }`}
      >
        <label htmlFor="pg-key" className="shrink-0 text-xs text-soft">
          Key
        </label>
        <input
          id="pg-key"
          type="password"
          value={apiKey}
          onChange={(e) => remember(e.target.value)}
          placeholder={endpoint.product === "spendgraph" ? "sg_…" : "lg_live_…"}
          className="min-w-0 grow rounded-md border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"
        />
        <span className="shrink-0 text-[11px] text-faint">
          {hasKey ? "kept in this browser" : "needed to send"}
        </span>
      </div>

      <div className="rounded-lg border border-line bg-surface p-3">
        <p className="mb-2.5 text-xs font-medium">Request</p>
        <div className="flex flex-col gap-2">
          {Object.keys(body).map((field) => {
            const spec = endpoint.params.find((p) => p.name === field);
            const control =
              "min-w-0 grow rounded-md border border-line bg-background px-2.5 py-1.5 font-mono text-xs text-foreground";
            const edit = (value: string) => {
              setBody({ ...body, [field]: value });
              forget();
            };

            return (
              <div
                key={field}
                className={`flex gap-2.5 ${spec?.field === "prose" ? "items-start" : "items-center"}`}
              >
                <label
                  htmlFor={`pg-${field}`}
                  className="w-24 shrink-0 pt-1.5 font-mono text-[11px] text-soft"
                >
                  {field}
                </label>
                {spec?.options ? (
                  // A select, not a text box: eight valid values and no list of
                  // them is a field you leave the page to fill in.
                  <select
                    id={`pg-${field}`}
                    value={body[field]}
                    onChange={(e) => edit(e.target.value)}
                    className={control}
                  >
                    {spec.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : spec?.field === "prose" ? (
                  <textarea
                    id={`pg-${field}`}
                    rows={3}
                    value={body[field]}
                    onChange={(e) => edit(e.target.value)}
                    className={`${control} resize-y leading-relaxed`}
                  />
                ) : (
                  <input
                    id={`pg-${field}`}
                    type="text"
                    value={body[field]}
                    onChange={(e) => edit(e.target.value)}
                    className={control}
                  />
                )}
              </div>
            );
          })}
          {Object.keys(body).length === 0 ? (
            <p className="text-xs text-faint">
              This call takes no body. Everything it needs is in the path.
            </p>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex items-center gap-0.5 border-b border-line p-1.5">
          {LANGS.map((one) => (
            <button
              key={one}
              type="button"
              onClick={() => setLang(one)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                lang === one ? "bg-ghost text-foreground" : "text-faint hover:text-soft"
              }`}
            >
              {LANG_LABEL[one]}
            </button>
          ))}
          <span className="ml-auto pr-1.5 text-[10px] text-faint">built from the fields above</span>
        </div>
        <Code text={code} lang={lang} />
      </div>

      <button
        type="button"
        disabled={!hasKey || pending}
        onClick={send}
        className="h-10 rounded-lg bg-s1 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:bg-ghost disabled:text-faint"
      >
        {pending ? "Sending" : result || failure ? "Send again" : "Send request"}
      </button>

      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex items-center gap-2 border-b border-line py-1.5 pr-1.5 pl-3">
          <span className="text-[11px] font-semibold">Response</span>
          {result ? (
            <span
              className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] font-medium ${
                result.ok ? "bg-s3/15 text-s3" : "bg-s2/15 text-s2"
              }`}
            >
              {result.status}
            </span>
          ) : null}
          {failure ? (
            <span className="rounded bg-s2/15 px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-s2">
              blocked
            </span>
          ) : null}
          <span className="ml-auto flex gap-0.5">
            {(["body", "headers"] as const).map((one) => (
              <button
                key={one}
                type="button"
                onClick={() => setTab(one)}
                className={`rounded px-2 py-1 text-[11px] font-medium capitalize ${
                  tab === one ? "bg-ghost text-foreground" : "text-faint hover:text-soft"
                }`}
              >
                {one}
              </button>
            ))}
          </span>
        </div>
        {result ? (
          <Code
            text={tab === "body" ? result.body : result.headers}
            lang={tab === "body" ? "json" : "plain"}
          />
        ) : failure ? (
          <p className="m-0 p-3.5 text-xs leading-relaxed text-s2">{failure}</p>
        ) : (
          <p className="m-0 p-3.5 text-xs text-faint">
            {pending ? (
              "Waiting for the API."
            ) : (
              <>
                Send the request to see what comes back. It goes from this browser straight to{" "}
                <span className="font-mono">
                  {API_BASE[endpoint.product]?.replace("https://", "")}
                </span>
                .
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
