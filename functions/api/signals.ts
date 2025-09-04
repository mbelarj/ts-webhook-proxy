export const onRequest: PagesFunction = async ({ request, env }) => {
  const kv = env.SIGNALS as KVNamespace;

  const json = (data: unknown, init: ResponseInit = {}) =>
    new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
      ...init,
    });

  if (request.method === "GET") {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    if (symbol) {
      const item = await kv.get(symbol, "json");
      return json(item ?? null);
    }
    const list = await kv.list();
    const items = await Promise.all(list.keys.map(k => kv.get(k.name, "json")));
    return json(items.filter(Boolean));
  }

  if (request.method === "POST") {
    let body: any = null;
    try { body = await request.json(); } catch {}
    if (!body?.symbol) return json({ ok:false, error:"symbol required" }, { status: 400 });
    await kv.put(body.symbol, JSON.stringify(body));
    return json({ ok:true });
  }

  return new Response(null, { status: 405 });
};
