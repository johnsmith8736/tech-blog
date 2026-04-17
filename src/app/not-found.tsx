import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404: This page could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glass-panel edge-frame panel-sheen w-full max-w-2xl overflow-hidden p-8 text-center">
        <div className="data-label text-[10px] text-slate-500">error // lost sector</div>
        <h1 className="mt-4 font-display text-6xl font-bold text-yellow-100">404</h1>
        <h2 className="mt-3 data-label text-lg text-white">transmission not found</h2>
        <p className="mt-4 text-sm text-slate-400">
          The requested data fragment does not exist in this archive, or the route has been burned.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-full border border-yellow-300/20 bg-yellow-300/[0.08] px-6 py-2 data-label text-yellow-100 transition-colors hover:border-cyan-300/30 hover:text-white">
          return_to_feed
        </Link>
      </div>
    </div>
  );
}
