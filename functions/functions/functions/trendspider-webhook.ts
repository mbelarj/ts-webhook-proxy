// Cloudflare Pages Function for TrendSpider webhooks
// Route: https://<your-project>.pages.dev/trendspider-webhook

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      // CORS so your Famous frontend can read GET results
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}

export const onRequestOptions: PagesFunction = async () => {
  // Preflight for browser GET/POST from your UI
  return json({ ok: true });
};

export const onRequestGet: PagesFunction = async ({ env }) => {
  const feed = (await env.SIGNALS.get('feed', 'json')) || [];
  return json(feed);
};

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  if (url.searchParams.get('secret') !== env.TS_WEBHOOK_SECRET) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let payload: any = {};
  try { payload = await request.json(); } catch {}

  const row = { ts: Date.now(), ...payload };

  const feed = (await env.SIGNALS.get('feed', 'json')) || [];
  feed.push(row);
  while (feed.length > 1000) feed.shift();

  await env.SIGNALS.put('feed', JSON.stringify(feed), {
    expirationTtl: 60 * 60 * 24 * 7, // 7 days
  });

  return json({ ok: true });
};

