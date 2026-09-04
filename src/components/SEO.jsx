import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Walnut Technologies';
const DEFAULT_URL = 'https://walnutmedical.in';
const DEFAULT_IMAGE = '/walnut-logo/Walnut_Technologies_logo_transparent.png';

export default function SEO({
  title,
  description,
  path = '',
  image,
  type = 'website',
  keywords,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Electronics for the World`;
  const url = `${DEFAULT_URL}${path}`;
  const ogImage = image ? (image.startsWith('http') ? image : `${DEFAULT_URL}${image}`) : `${DEFAULT_URL}${DEFAULT_IMAGE}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
