// functions/api/signals.ts
type Env = { SIGNALS: KVNamespace };

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export const onRequestOptions: PagesFunction = async () => json({ ok: true });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol");

  // GET /api/signals?symbol=TSLA -> single item (404 if missing)
  if (symbol) {
    const value = await env.SIGNALS.get(symbol, "json");
    return value ? json(value) : json({ error: "not found" }, { status: 404 });
  }

  // GET /api/signals -> list everything we have
  const { keys } = await env.SIGNALS.list();
  const rows: unknown[] = [];
  for (const k of keys) {
    const v = await env.SIGNALS.get(k.name, "json");
    if (v) rows.push({ symbol: k.name, ...v });
  }
  return json(rows);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: any;
  try { body = await request.json(); } catch { return json({ error: "invalid json" }, { status: 400 }); }
  if (!body?.symbol) return json({ error: "symbol required" }, { status: 400 });

  const record = { ...body, ts: Date.now() };
  await env.SIGNALS.put(body.symbol, JSON.stringify(record));
  return json({ ok: true });
};
