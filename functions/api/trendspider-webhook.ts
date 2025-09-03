export async function onRequestPost({ request }) {
  const data = await request.json();
  console.log("Webhook received:", data);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

