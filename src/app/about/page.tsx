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
        <p className="mb-3 data-label text-[10px] text-yellow-100">mission log</p>
        <h1 className="mb-3 max-w-3xl glitch-text font-display text-4xl font-semibold text-white md:text-5xl">
          Stanley Chan
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
          This node documents Linux systems, proxy routes, Python workflows, and practical self-hosted setups.
          The goal is simple: keep the signal high and the interface sharp.
        </p>
      </div>

      <div className="glass-panel edge-frame p-6 text-sm leading-7 text-slate-300">
        <p>
          Browse by sector from the sidebar. Linux, Python, Networking, and related routes are grouped into focused
          channels so the archive stays fast to scan.
        </p>
        <p className="mt-4 text-slate-400">
          The visual direction now follows a harder netrunner terminal style: darker surfaces, yellow signal glow,
          cyan support accents, and transmission-first wording across the whole site.
        </p>
      </div>
    </div>
  );
}
