export async function onRequest() {
  return new Response(
    JSON.stringify({ ok: true, status: "healthy" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
