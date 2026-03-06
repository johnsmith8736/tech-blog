const defaultSiteUrl = "https://johnsmith8736.github.io/tech-blog";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/+$/, "");
export const SITE_NAME = "Stanley Chan Tech Blog";
export const SITE_AUTHOR = "Stanley Chan";
export const SITE_DESCRIPTION =
  "Practical tutorials and field notes on Linux, Python, networking, and systems engineering.";

export function toAbsoluteUrl(path: string) {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
