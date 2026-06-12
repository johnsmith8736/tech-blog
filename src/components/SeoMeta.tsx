import { Helmet } from 'react-helmet-async';

type SeoMetaProps = {
  title?: string;
  description?: string;
  path?: string;
};

const SITE_NAME = 'STANLEY.CHAN // NETRUNNER';
const SITE_DESC = 'Technical blog covering network infrastructure, proxy protocols, and self-hosted solutions — cyberpunk edition.';
const BASE_URL = 'https://atlassc.net';

export function SeoMeta({ title, description, path = '' }: SeoMetaProps) {
  const fullTitle = title ? `${title} // ${SITE_NAME}` : `${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? SITE_DESC} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description ?? SITE_DESC} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description ?? SITE_DESC} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}