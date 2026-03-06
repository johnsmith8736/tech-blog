export interface SiteSubsection {
  slug: string;
  label: string;
}

export interface SiteSection {
  slug: string;
  label: string;
  children: SiteSubsection[];
}

export const SITE_SECTIONS: SiteSection[] = [
  {
    slug: 'linux',
    label: 'Linux',
    children: [
      { slug: 'arch-linux', label: 'Arch Linux' },
      { slug: 'linux-tools', label: 'Linux Tools' },
      { slug: 'linux-gaming', label: 'Linux Gaming' },
      { slug: 'linux-server', label: 'Linux Server' },
    ],
  },
  {
    slug: 'python',
    label: 'Python',
    children: [
      { slug: 'web-scraping', label: 'Web Scraping' },
      { slug: 'automation', label: 'Automation' },
      { slug: 'python-scripts', label: 'Python Scripts' },
      { slug: 'python-tutorials', label: 'Python Tutorials' },
    ],
  },
  {
    slug: 'networking',
    label: 'Networking',
    children: [
      { slug: 'proxy', label: 'Proxy' },
      { slug: 'self-hosted', label: 'Self-hosted' },
      { slug: 'vps', label: 'VPS' },
      { slug: 'home-network', label: 'Home Network' },
    ],
  },
];

export function getSectionLabel(sectionSlug: string): string | undefined {
  return SITE_SECTIONS.find((section) => section.slug === sectionSlug)?.label;
}

export function getSubsectionLabel(sectionSlug: string, subsectionSlug: string): string | undefined {
  const section = SITE_SECTIONS.find((item) => item.slug === sectionSlug);
  return section?.children.find((child) => child.slug === subsectionSlug)?.label;
}
