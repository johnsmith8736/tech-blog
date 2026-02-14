import { getSortedPostsData, PostData } from '@/lib/posts';
import FilteredPostList from '@/components/FilteredPostList';
import { Suspense } from 'react';

export default async function HomePage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="space-y-0">
      <div className="glass-panel edge-frame mb-10 overflow-hidden p-6 md:p-8">
        <p className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-cyan-200/85">Signal Directory</p>
        <h1 className="mb-3 font-display text-4xl font-bold text-white md:text-5xl">
          TRANSMISSIONS
        </h1>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-slate-300">
          Curated field notes on systems, infrastructure, and practical engineering workflows.
        </p>
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
