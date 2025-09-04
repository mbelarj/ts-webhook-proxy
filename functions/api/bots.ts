export const onRequest: PagesFunction = async () => {
  return new Response(JSON.stringify({ bots: ["demo-bot"] }), {
    headers: { "Content-Type": "application/json" },
  });
};
