// functions/api/signals.ts
export async function onRequest({ request, env }: any) {
  if (request.method === "GET") {
    // List all keys and fetch their values
    const keys = await env.SIGNALS.list();
    const results = [];

    for (const k of keys.keys) {
      const value = await env.SIGNALS.get(k.name, "json");
      results.push({ key: k.name, value });
    }

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "POST") {
    // Store/update the latest value for a symbol
    const body = await request.json();
    if (!body.symbol) {
      return new Response(
        JSON.stringify({ error: "Missing symbol in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await env.SIGNALS.put(body.symbol, JSON.stringify(body));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
