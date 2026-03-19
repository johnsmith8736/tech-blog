import { getSortedPostsData, PostData } from '@/lib/posts';
import FilteredPostList from '@/components/FilteredPostList';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { SITE_SECTIONS } from '@/lib/site-structure';

export const metadata: Metadata = {
  title: 'Linux, Python & Networking Tutorials',
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function HomePage() {
  const allPostsData: PostData[] = getSortedPostsData();
  const sectionCount = SITE_SECTIONS.length;
  const topicCount = SITE_SECTIONS.reduce((total, section) => total + section.children.length, 0);
  const latestPost = allPostsData[0];
  const featuredTags = Array.from(
    new Set(allPostsData.flatMap((post) => post.tags ?? [])),
  ).slice(0, 4);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="glass-panel edge-frame panel-sheen relative overflow-hidden p-6 md:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-[0.12]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.12),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_36%)]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.85fr] lg:items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-300">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-400/8 px-3 py-1 text-cyan-100">Signal Directory</span>
              <span className="rounded-full border border-slate-500/30 bg-slate-900/45 px-3 py-1">Curated archive</span>
              <span className="rounded-full border border-amber-300/25 bg-amber-400/8 px-3 py-1 text-amber-100">Realtime search</span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                <span className="block">TRANSMISSIONS</span>
                <span className="block text-glow-cyan text-cyan-200/90">for practical systems work.</span>
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Curated field notes on Linux, Python, networking, and infrastructure workflows.
                The layout keeps the cyber tone, but pushes contrast, hierarchy, and polish.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-500/30 bg-slate-950/40 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-5 backdrop-blur-sm">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-400">Archive Stats</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3">
                  <div className="text-2xl font-display font-bold text-white">{allPostsData.length}</div>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Posts</div>
                </div>
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3">
                  <div className="text-2xl font-display font-bold text-white">{sectionCount}</div>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Sections</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-5 backdrop-blur-sm">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-400">Latest Signal</div>
              <div className="mt-4 space-y-2">
                <div className="font-display text-xl font-bold text-white">{latestPost?.title ?? 'No transmissions yet'}</div>
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-cyan-200">
                  {latestPost?.date ?? '—'} / {topicCount} subtopics
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="py-8 text-center font-mono text-slate-400">LOADING TRANSMISSIONS...</div>}>
        <FilteredPostList allPostsData={allPostsData} />
      </Suspense>

      {allPostsData.length === 0 && (
        <div className="glass-panel py-12 text-center font-mono text-slate-400">
          {/**/}NO TRANSMISSIONS FOUND. SYSTEM STANDBY.
        </div>
      )}
    </div>
  );
}
