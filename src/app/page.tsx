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
  const recentSignals = allPostsData.slice(0, 3);
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
      <div className="glass-panel edge-frame relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 soft-grid opacity-[0.05]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-300/80 to-cyan-300/45" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 data-label text-[10px] text-slate-300">
              <span className="rounded-full border border-yellow-300/22 bg-yellow-300/[0.08] px-3 py-1 text-yellow-100">stream.live</span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-slate-200">night relay archive</span>
            </div>

            <div className="space-y-3">
              <p className="data-label text-[11px] text-slate-500">cityline channel // practical notes</p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl lg:text-[3.7rem]">
                <span className="block glitch-text">Signal-First Writing</span>
                <span className="block text-yellow-100">for Systems, Relays, and Scrapers.</span>
              </h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-300/90 md:text-base">
                A dense archive of Linux fieldwork, proxy experiments, and Python scraping notes.
                Built to feel like a live terminal channel, not a polished magazine.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.15rem] border border-white/8 bg-slate-950/32 p-4">
                <div className="data-label text-[10px] text-slate-500">transmissions</div>
                <div className="mt-2 font-display text-3xl font-semibold text-white">{allPostsData.length}</div>
              </div>
              <div className="rounded-[1.15rem] border border-white/8 bg-slate-950/32 p-4">
                <div className="data-label text-[10px] text-slate-500">sectors</div>
                <div className="mt-2 font-display text-3xl font-semibold text-white">{sectionCount}</div>
              </div>
              <div className="rounded-[1.15rem] border border-white/8 bg-slate-950/32 p-4">
                <div className="data-label text-[10px] text-slate-500">nodes</div>
                <div className="mt-2 font-display text-3xl font-semibold text-white">{topicCount}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 data-label text-[11px] text-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.3rem] border border-yellow-300/10 bg-white/[0.035] p-5">
              <div className="data-label text-[10px] text-slate-500">latest signal</div>
              <div className="mt-3 font-display text-2xl font-semibold leading-tight text-white">
                {latestPost?.title ?? 'No transmissions yet'}
              </div>
              <div className="mt-3 data-label text-[10px] text-yellow-100">
                {latestPost?.date ?? '—'} || primary route online
              </div>
            </div>

            <div className="rounded-[1.3rem] border border-white/8 bg-slate-950/28 p-5">
              <div className="data-label text-[10px] text-slate-500">recent packets</div>
              <div className="mt-4 space-y-3">
                {recentSignals.map((post, index) => (
                  <div key={post.slug} className="border-b border-white/8 pb-3 last:border-0 last:pb-0">
                    <div className="data-label text-[10px] text-slate-500">
                      {String(index + 1).padStart(2, '0')} || {post.date}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-200">{post.title}</div>
                  </div>
                ))}
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
