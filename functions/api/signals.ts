export async function onRequest({ request, env }) {
  if (request.method === "GET") {
    const keys = await env.SIGNALS.list();
    return new Response(JSON.stringify(keys), {
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

