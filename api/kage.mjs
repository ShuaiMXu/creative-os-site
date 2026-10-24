import { fetch, EnvHttpProxyAgent } from "undici";
const dispatcher = new EnvHttpProxyAgent();
const endpoint = "https://kage.design/mcp";
export async function boundedText(response) {
  let size = 0;
  const chunks = [];
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > 2 * 1024 * 1024) throw Error("Kage response too large");
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}
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
    const result = decode(await boundedText(r));
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
export function normalizeComponent(x) {
  if (!x || typeof x !== "object") return null;
  return {
    slug: text(x.slug),
    title: text(x.title),
    description: text(x.description),
    kind: text(x.kind),
    image: safeUrl(x.image_url),
    source: safeUrl(x.page_url),
    prompt: text(x.prompt),
  };
}
export function normalizeDesign(x) {
  return {
    slug: text(x.slug),
    title: text(x.title),
    description: text(x.description),
    image: safeUrl(x.thumbnail_url || x.screenshot_url),
    fullImage: safeUrl(x.screenshot_url),
    fullPageImage: safeUrl(x.full_page_url),
    website: safeUrl(x.source_url || x.product?.website_url),
    components: Array.isArray(x.components)
      ? x.components.map(normalizeComponent).filter(Boolean)
      : [],
    source: safeUrl(x.page_url),
    product: text(x.product?.name),
    styles: Array.isArray(x.styles)
      ? x.styles.filter((v) => typeof v === "string")
      : [],
    prompt: text(x.prompt),
  };
}
export async function searchKage(query) {
  const data = await callKage("search_designs", { ...(query ? { query } : {}), limit: 24 });
  return {
    designs: (Array.isArray(data.designs) ? data.designs : [])
      .slice(0, 24)
      .map(normalizeDesign),
  };
}
export function normalizeDesignResponse(result) {
  const design = result?.design ?? result;
  if (!design || typeof design !== "object" || !text(design.slug) || !text(design.title)) {
    throw Error("Invalid Kage design response");
  }
  return { design: normalizeDesign(design) };
}
export async function getKage(slug) {
  return normalizeDesignResponse(await callKage("get_design", { slug, include_image: false }));
}

export function createHandler({ search = searchKage, detail = getKage, now = Date.now } = {}) {
  let activeRequests = 0;
  const cache = new Map();
  let windowStart = now(), requests = 0;
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      res.statusCode = 405;
      return res.end();
    }
    const params = new URL(req.url, "http://localhost").searchParams;
    const query = params.get("query")?.trim(),
      slug = params.get("slug"),
      browse = params.get("browse") === "all";
    res.setHeader("Content-Type", "application/json");
    if (
      slug ? !/^[a-zA-Z0-9_-]{1,200}$/.test(slug) : browse ? !!query : !query || query.length > 160
    ) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Invalid query" }));
    }
    const key = slug ? `detail:${slug}` : `search:${query || ""}`;
    const cached = cache.get(key);
    if (cached && cached.expires > now()) {
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
      return res.end(cached.body);
    }
    if (cached) cache.delete(key);
    // Instance-local safeguard, supplementary to distributed edge protection.
    if (now() - windowStart >= 60000) { windowStart = now(); requests = 0; }
    if (activeRequests >= 4 || requests >= 30) {
      res.statusCode = 429;
      res.setHeader("Retry-After", "60");
      return res.end(JSON.stringify({ error: "Please retry shortly." }));
    }
    requests++;
    activeRequests++;
    try {
      const body = JSON.stringify(slug ? await detail(slug) : await search(query));
      if (cache.size >= 32) cache.delete(cache.keys().next().value);
      cache.set(key, {body, expires: now() + 300000});
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
      res.end(body);
    } catch {
      res.statusCode = 502;
      res.end(JSON.stringify({ error: "Kage is unavailable. Please retry." }));
    } finally {
      activeRequests--;
    }
  }

}
export default createHandler();
