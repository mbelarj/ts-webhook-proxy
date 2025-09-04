// functions/api/signals.ts
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

export async function onRequest({ request, env }: { request: Request; env: { SIGNALS: KVNamespace } }) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") return json(null, 204);

  if (request.method === "GET") {
    const symbol = url.searchParams.get("symbol");
    if (symbol) {
      const val = await env.SIGNALS.get(symbol, "json");
      return json(val ?? { error: "not found" }, val ? 200 : 404);
    }
    const list = await env.SIGNALS.list();
    const keys = list.keys.map(k => k.name);
    const vals = await Promise.all(keys.map(k => env.SIGNALS.get(k, "json")));
    const out = Object.fromEntries(keys.map((k, i) => [k, vals[i]]));
    return json(out);
  }

  if (request.method === "POST") {
    const body = await request.json().catch(() => null);
    if (!body || !body.symbol) return json({ error: "symbol required" }, 400);

    const value = { ...body, ts: Date.now() };
    await env.SIGNALS.put(body.symbol, JSON.stringify(value));
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
}
