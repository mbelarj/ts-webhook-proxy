// functions/api/signals.ts
export async function onRequest({ request, env }) {
  if (request.method === "GET") {
    const keys = await env.SIGNALS.list();
    const results = [];
    for (const key of keys.keys) {
      const value = await env.SIGNALS.get(key.name, "json");
      results.push({ key: key.name, value });
    }
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "POST") {
    const body = await request.json();
    await env.SIGNALS.put(body.symbol, JSON.stringify(body));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
