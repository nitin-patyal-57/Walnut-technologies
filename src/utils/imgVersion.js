// Appends a cache-bust token to an internal image path.
//
// vercel.json serves images with `max-age=604800` (7 days), so a bad response
// that ever lands in a browser's cache (e.g. while DNS briefly resolved the
// domain to a broken IP, which made the header logo 404 for days) keeps
// showing until the entry expires. Responsive variants already carry a `?v=`
// token through Picture.jsx; the images referenced by plain paths did not.
//
// Rules: only root-relative paths are touched, and anything that already has
// a query string (including `?v=` variants) is returned unchanged so tokens
// are never doubled up.
const VERSION = '2';

export default function imgV(src) {
  if (typeof src !== 'string' || !src.startsWith('/') || src.includes('?')) return src;
  return `${src}?v=${VERSION}`;
}
