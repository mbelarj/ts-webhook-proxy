export async function onRequest() {
  return new Response(JSON.stringify({ bots: [] }), {
    headers: { "Content-Type": "application/json" },
  });
}

