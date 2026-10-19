// Cache-bust token for the generated responsive image variants.
//
// The `-480/-768/-1280/-1920` filenames are stable across builds, but vercel.json
// serves images with `max-age=604800` (7 days). So when the variants are
// re-encoded — e.g. the encode-quality bump in scripts/responsive-images.mjs —
// browsers keep showing the old bytes until their cache expires.
//
// Appending this as a `?v=` query to every variant URL changes the cache key, so
// a bump makes the new files load right away for every visitor.
//
// Bump this whenever you re-run `npm run images` with changed encode settings.
export const VARIANT_VERSION = '3';
