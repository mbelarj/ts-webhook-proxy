// functions/api/signals.ts

export async function onRequestGet({ env }: { env: any }) {
  const keys = await env.SIGNALS.list();
  return new Response(JSON.stringify(keys), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  const body = await request.json();
  await env.SIGNALS.put(body.symbol, JSON.stringify(body));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
