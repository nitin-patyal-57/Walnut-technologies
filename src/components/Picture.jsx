import variants from '../data/imageVariants.json';

const stripQuery = (s) => s.split('?')[0];

function keyOf(src) {
  if (typeof src !== 'string' || !src.startsWith('/')) return null;
  return stripQuery(src).slice(1).replace(/\.[a-z0-9]+$/i, '');
}

export default function Picture({ src, alt = '', sizes = '100vw', ...props }) {
  const key = keyOf(src);
  const entry = key ? variants[key] : null;

  if (!entry || !entry.avif || entry.avif.length === 0) {
    return <img src={src} alt={alt} {...props} />;
  }

  const clean = stripQuery(src);
  const slash = clean.lastIndexOf('/');
  const dir = clean.slice(0, slash + 1);
  const name = clean.slice(slash + 1).replace(/\.[a-z0-9]+$/i, '');
  const at = (w, format) => `${dir}${name}-${w}.${format}`;

  const avifSet = entry.avif.map((w) => `${at(w, 'avif')} ${w}w`).join(', ');
  const webpPairs = entry.webp.map((w) => `${at(w, 'webp')} ${w}w`);
  if (!entry.webp.includes(entry.fallbackWidth)) {
    webpPairs.push(`${clean} ${entry.fallbackWidth}w`);
  }
  const webpSet = webpPairs.join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={avifSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img src={src} alt={alt} sizes={sizes} srcSet={webpSet} {...props} />
    </picture>
  );
}
