// functions/api/signals.ts
export async function onRequest({ request, env }) {
  const kv = env.SIGNALS; // KV binding must be added in Pages → Settings → Functions → KV bindings

  if (request.method === "GET") {
    const url = new URL(request.url);
    const symbol = url.searchParams.get("symbol");

    if (symbol) {
      const rec = await kv.get(symbol, "json");
      return new Response(JSON.stringify(rec ?? null), {
        headers: { "content-type": "application/json" },
      });
    }

    const { keys } = await kv.list();
    const items = await Promise.all(keys.map(k => kv.get(k.name, "json")));
    return new Response(JSON.stringify(items.filter(Boolean)), {
      headers: { "content-type": "application/json" },
    });
  }

  if (request.method === "POST") {
    const payload = await request.json();
    if (!payload?.symbol) {
      return new Response(JSON.stringify({ error: "symbol required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    await kv.put(payload.symbol, JSON.stringify({ ...payload, ts: Date.now() }));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
