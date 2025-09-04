// functions/api/signals.ts

export const onRequestGet: PagesFunction = async ({ env }) => {
  const keys = await env.SIGNALS.list();
  return new Response(JSON.stringify(keys), {
    headers: { "Content-Type": "application/json" },
  });
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const body = await request.json();
  await env.SIGNALS.put(body.symbol, JSON.stringify(body));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
