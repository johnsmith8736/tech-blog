'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-panel edge-frame panel-sheen w-full max-w-2xl overflow-hidden p-8 text-center">
        <div className="data-label text-[10px] text-slate-500">error // system fault</div>
        <h1 className="mt-4 font-display text-6xl font-bold text-yellow-100">500</h1>
        <h2 className="mt-3 data-label text-lg text-white">system error</h2>
        <p className="mt-4 text-sm text-slate-400">
          An internal system fault has occurred. Retry the link or route back to the main feed.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-full border border-yellow-300/20 bg-yellow-300/[0.08] px-6 py-2 data-label text-yellow-100 transition-colors hover:border-cyan-300/30 hover:text-white">
          return_to_feed
        </Link>
      </div>
    </div>
  );
}
