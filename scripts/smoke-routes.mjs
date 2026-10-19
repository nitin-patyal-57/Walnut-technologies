// Runtime smoke test against a running server (dev or preview).
// Fetches each route and checks it returns HTML without a server-side crash.
const base = process.env.BASE || 'http://localhost:4173';

const routes = [
  '/', '/about', '/solutions', '/process', '/expertise', '/clients',
  '/resources', '/news', '/career', '/apply', '/contact', '/privacy', '/terms',
  '/about/evolution/foundation', '/about/future/global',
  '/expertise/medical-electronics', '/p/does-not-exist', '/definitely-not-a-route',
];

let fail = 0;
for (const r of routes) {
  try {
    const res = await fetch(base + r, { redirect: 'manual' });
    const body = await res.text();
    const isHtml = (res.headers.get('content-type') || '').includes('text/html');
    // A crashed SPA still returns 200 HTML, so look for real error markers.
    const crashed = /Cannot GET|Internal Server Error|ReferenceError|TypeError|__error/.test(body);
    const hasRoot = body.includes('id="root"');
    const ok = res.status === 200 && isHtml && hasRoot && !crashed;
    if (!ok) fail++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'}  ${String(res.status)}  ${r}${crashed ? '   <-- ERROR MARKER IN BODY' : ''}${!isHtml ? '   <-- not HTML' : ''}`);
  } catch (e) {
    fail++;
    console.log(`  FAIL  ERR   ${r}   <-- ${e.message}`);
  }
}
console.log('');
console.log(fail === 0 ? `ALL ${routes.length} ROUTES SERVE CORRECTLY` : `${fail} ROUTE(S) FAILED`);
process.exitCode = fail === 0 ? 0 : 1;
