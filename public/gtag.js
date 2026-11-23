// Google Tag Manager dataLayer bootstrap.
// This used to be an inline <script> in index.html, but the site's
// Content-Security-Policy (index.html meta + vercel.json header) has no
// 'unsafe-inline', so the browser blocked it and analytics never started.
// Keep it as its own file: script-src 'self' allows it.
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
