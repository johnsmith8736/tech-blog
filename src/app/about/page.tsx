export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel edge-frame overflow-hidden p-6 md:p-8">
        <p className="mb-3 text-xs font-mono uppercase tracking-[0.2em] text-cyan-200/85">About</p>
        <h1 className="mb-3 font-display text-4xl font-bold text-white md:text-5xl">Stanley Chan</h1>
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          This blog focuses on Linux, Python, networking, and practical tutorials.
          Content is organized as a directory so readers can quickly jump to a specific topic.
        </p>
      </div>

      <div className="glass-panel edge-frame p-6 font-mono text-sm leading-7 text-slate-300">
        <p>
          You can browse by section from the sidebar: Linux, Python, Networking, and Tutorials.
          Each section includes focused subcategories for faster discovery.
        </p>
      </div>
    </div>
  );
}
