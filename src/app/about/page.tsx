import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Stanley Chan and the mission of this technical blog.',
  alternates: {
    canonical: '/about/',
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel edge-frame panel-sheen overflow-hidden p-6 md:p-8">
        <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-100">About</p>
        <h1 className="mb-3 max-w-3xl font-display text-4xl font-semibold text-white md:text-5xl">
          Stanley Chan
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
          This blog is a small editorial workspace for Linux, Python, networking, and practical systems work.
          The goal is to keep the interface calm, the reading experience clear, and the technical signal high.
        </p>
        <p className="mt-4 text-sm text-cyan-100 md:text-base">
          Homepage:{' '}
          <a
            href="https://tech.stanleychan87.nyc.mn/"
            className="font-mono text-cyan-200 underline decoration-cyan-400/60 underline-offset-4 transition hover:text-white"
          >
            https://tech.stanleychan87.nyc.mn/
          </a>
        </p>
      </div>

      <div className="glass-panel edge-frame p-6 text-sm leading-7 text-slate-300">
        <p>
          Browse by section from the sidebar. Linux, Python, Networking, and Tutorials are grouped into focused
          subcategories so the archive stays searchable without feeling dense.
        </p>
        <p className="mt-4 text-slate-400">
          The visual direction keeps a light hacker accent, but the main surface stays polished and restrained.
        </p>
      </div>
    </div>
  );
}
