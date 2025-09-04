// functions/api/signals.ts
export const onRequestGet: PagesFunction = async () => {
  return new Response(JSON.stringify({ route: "/api/signals", method: "GET" }), {
    headers: { "content-type": "application/json" },
  });
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  const body = await request.text();
  return new Response(JSON.stringify({ route: "/api/signals", method: "POST", echo: body }), {
    headers: { "content-type": "application/json" },
  });
};
