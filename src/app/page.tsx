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
      <div className="glass-panel edge-frame panel-sheen relative overflow-hidden p-7 ring-1 ring-white/5 md:p-9 lg:p-11">
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-[0.075]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,197,253,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(209,180,111,0.08),transparent_34%)]" />

        <div className="relative grid gap-12 lg:grid-cols-[1.28fr_0.92fr] lg:items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">Editorial archive</span>
              <span className="rounded-full border border-cyan-200/20 bg-cyan-200/[0.06] px-3 py-1 text-cyan-100">Searchable notes</span>
              <span className="rounded-full border border-amber-200/18 bg-amber-200/[0.06] px-3 py-1 text-amber-100">Data-rich reads</span>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400">
                Refined technical writing
              </p>
              <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
                <span className="block">A polished system</span>
                <span className="block text-glow-cyan text-cyan-100">for practical engineering notes.</span>
              </h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-300/90 md:text-base">
                Linux, Python, networking, and infrastructure workflows presented with more breathing room,
                softer contrast, and a cleaner reading surface.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-400">Archive stats</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                  <div className="text-2xl font-display font-semibold text-white">{allPostsData.length}</div>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Posts</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                  <div className="text-2xl font-display font-semibold text-white">{sectionCount}</div>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Sections</div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-400">Latest signal</div>
              <div className="mt-4 space-y-2">
                <div className="font-display text-xl font-semibold leading-snug text-white">{latestPost?.title ?? 'No transmissions yet'}</div>
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-cyan-100">
                  {latestPost?.date ?? '—'} / {topicCount} subtopics
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="py-8 text-center font-mono text-slate-400">Loading archive...</div>}>
        <FilteredPostList allPostsData={allPostsData} />
      </Suspense>

      {allPostsData.length === 0 && (
        <div className="glass-panel py-12 text-center font-mono text-slate-400">
          No posts found. System standby.
        </div>
      )}
    </div>
  );
}
