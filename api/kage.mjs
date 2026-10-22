import { fetch, EnvHttpProxyAgent } from "undici";
const dispatcher = new EnvHttpProxyAgent();
const endpoint = "https://kage.design/mcp";
let activeRequests = 0;
function decode(text) {
  if (text.trim().startsWith("{")) return JSON.parse(text);
  for (const line of text.split("\n"))
    if (line.startsWith("data:")) {
      const value = JSON.parse(line.slice(5));
      if (value.result || value.error) return value;
    }
  throw Error("Invalid MCP response");
}
async function callKage(name, args) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  async function rpc(id, method, params) {
    const r = await fetch(endpoint, {
      dispatcher,
      method: "POST",
      headers,
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) throw Error("Kage unavailable");
    const session = r.headers.get("mcp-session-id");
    if (session) headers["mcp-session-id"] = session;
    const result = decode(await r.text());
    if (result.error || result.result?.isError)
      throw Error("Kage query failed");
    return result.result;
  }
  await rpc(1, "initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "happyhands", version: "0.1.0" },
  });
  headers["MCP-Protocol-Version"] = "2025-03-26";
  const result = await rpc(2, "tools/call", { name, arguments: args });
  return JSON.parse(result.content.find((x) => x.type === "text").text);
}
const safeUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
};
const text = (value) => (typeof value === "string" ? value : "");
export function normalizeDesign(x) {
  return {
    slug: text(x.slug),
    title: text(x.title),
    description: text(x.description),
    image: safeUrl(x.thumbnail_url || x.screenshot_url),
    fullImage: safeUrl(x.screenshot_url),
    source: safeUrl(x.page_url),
    product: text(x.product?.name),
    styles: Array.isArray(x.styles)
      ? x.styles.filter((v) => typeof v === "string")
      : [],
    prompt: text(x.prompt),
  };
}
export async function searchKage(query) {
  const data = await callKage("search_designs", { query, limit: 6 });
  return {
    designs: (Array.isArray(data.designs) ? data.designs : [])
      .slice(0, 6)
      .map(normalizeDesign),
  };
}
export async function getKage(slug) {
  return {
    design: normalizeDesign(
      await callKage("get_design", { slug, include_image: false }),
    ),
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end();
  }
  const params = new URL(req.url, "http://localhost").searchParams;
  const query = params.get("query")?.trim(),
    slug = params.get("slug");
  res.setHeader("Content-Type", "application/json");
  if (
    slug ? !/^[a-zA-Z0-9_-]{1,200}$/.test(slug) : !query || query.length > 160
  ) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: "Invalid query" }));
  }
  if (activeRequests >= 4) {
    res.statusCode = 429;
    res.setHeader("Retry-After", "15");
    return res.end(JSON.stringify({ error: "Please retry shortly." }));
  }
  activeRequests++;
  try {
    res.end(
      JSON.stringify(slug ? await getKage(slug) : await searchKage(query)),
    );
  } catch {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: "Kage is unavailable. Please retry." }));
  } finally {
    activeRequests--;
  }
}
