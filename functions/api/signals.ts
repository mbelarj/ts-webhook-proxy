// functions/api/signals.ts
export const onRequest: PagesFunction = async ({ request, env }) => {
  const kv = env.SIGNALS as KVNamespace;

  if (request.method === "GET") {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (symbol) {
      const val = await kv.get(symbol);
      return new Response(val ?? "null", {
        headers: { "content-type": "application/json" },
        status: val ? 200 : 404,
      });
    }

    // list all keys
    const list = await kv.list();
    return new Response(JSON.stringify(list.keys), {
      headers: { "content-type": "application/json" },
    });
  }

  if (request.method === "POST") {
    const body = await request.json();
    if (!body?.symbol) {
      return new Response(JSON.stringify({ ok: false, error: "symbol required" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }
    await kv.put(body.symbol, JSON.stringify(body));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
