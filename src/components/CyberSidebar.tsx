
import Image from 'next/image';
import Link from 'next/link';
import { SITE_SECTIONS } from '@/lib/site-structure';

export default function CyberSidebar() {
    return (
        <aside className="w-full flex-shrink-0 space-y-6 lg:w-80">
            <div className="glass-panel edge-frame panel-sheen relative overflow-hidden p-6">
                <div className="pointer-events-none absolute inset-0 soft-grid opacity-10" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,197,253,0.11),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(209,180,111,0.08),transparent_32%)]" />

                <div className="relative z-10 space-y-6">
                    <div className="flex gap-4">
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_16px_45px_rgba(0,0,0,0.22)]">
                            <Image
                                src="/kali-logo.png"
                                alt="Stanley Chan avatar"
                                width={64}
                                height={64}
                                className="object-contain p-2"
                            />
                        </div>

                        <div className="min-w-0 space-y-2">
                            <div>
                                <h2 className="font-display text-2xl font-semibold tracking-[0.04em] text-white">Stanley Chan</h2>
                                <p className="text-sm text-slate-300">@stanleychan87</p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-200">
                                <span className="rounded-full border border-cyan-200/20 bg-cyan-200/[0.06] px-2.5 py-1 text-cyan-100">Level 50</span>
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">Netrunner</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-sm leading-7 text-slate-300">
                            High-signal notes on Linux, Python, networking, and self-hosting. Technical, but not noisy.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-white/8 pt-4">
                        <a
                            href="https://x.com/stanleychan87"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.06] hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            X
                        </a>
                        <a
                            href="https://github.com/johnsmith8736"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.06] hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </a>
                        <a
                            href="https://www.youtube.com/@stanleychan87"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.06] hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            YouTube
                        </a>
                        <a
                            href="https://t.me/stanleychan87"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.06] hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.78 18.65c-.35 0-.29-.13-.41-.47l-1.04-3.41 8.6-5.44c.4-.24.69-.11.39.16l-6.96 6.28-.26 3.41c.38 0 .55-.17.76-.37l1.82-1.76 3.78 2.79c.7.39 1.19.19 1.37-.65l2.48-11.68c.26-1.03-.39-1.5-1.05-1.2L4.83 12.1c-1 .4-.99.96-.18 1.21l3.56 1.11 8.25-5.2c.39-.24.74-.11.44.16" />
                            </svg>
                            Telegram
                        </a>
                        <a
                            href="https://www.instagram.com/izumi.misaki87/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.06] hover:text-white"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Instagram
                        </a>
                    </div>

                    <div className="grid gap-3 text-xs font-mono text-slate-300">
                        <div className="flex items-center gap-3">
                            <span className="w-14 text-slate-400">RAM</span>
                            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div className="absolute inset-y-0 left-0 w-[64%] rounded-full bg-gradient-to-r from-cyan-200 to-sky-300" />
                            </div>
                            <span className="w-8 text-right text-cyan-100">64%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-14 text-slate-400">ICE</span>
                            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div className="absolute inset-y-0 left-0 w-[22%] rounded-full bg-gradient-to-r from-amber-200 to-orange-300" />
                            </div>
                            <span className="w-8 text-right text-amber-100">22%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-14 text-slate-400">UPLINK</span>
                            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div className="absolute inset-y-0 left-0 w-[74%] rounded-full bg-gradient-to-r from-sky-200 to-cyan-300" />
                            </div>
                            <span className="w-8 text-right text-sky-100">42MS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel edge-frame relative space-y-4 p-5">
                <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-white/20" />
                <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-white/20" />

                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">Site Map</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-100">Structured browse</div>
                </div>

                <div className="space-y-2 text-sm">
                    <Link
                        href="/"
                        className="block rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-slate-100 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.06]"
                    >
                        Home
                    </Link>

                    {SITE_SECTIONS.map((section) => (
                        <div key={section.slug} className="space-y-2 rounded-2xl border border-white/8 bg-white/[0.025] p-3">
                            <Link
                                href={`/?section=${section.slug}`}
                                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-cyan-100"
                            >
                                {section.label}
                            </Link>
                            <div className="grid gap-1.5 pl-1">
                                {section.children.map((child) => (
                                    <Link
                                        key={child.slug}
                                        href={`/?section=${section.slug}&sub=${child.slug}`}
                                        className="block text-[12px] text-slate-400 transition-colors hover:text-white"
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Link
                        href="/about"
                        className="block rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-slate-100 transition-colors hover:border-cyan-200/35 hover:bg-white/[0.06]"
                    >
                        About
                    </Link>
                </div>
            </div>

            <div className="glass-panel edge-frame relative space-y-4 p-5">
                <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-cyan-200/30" />
                <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-200/30" />

                <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">System Status</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-100">Healthy</div>
                </div>
                <div className="space-y-2 text-[11px] font-mono tracking-[0.16em] text-slate-300">
                    <div className="flex items-center justify-between border-b border-white/8 pb-2">
                        <span className="text-slate-400">Firewall</span>
                        <span className="text-emerald-100">Active</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/8 pb-2">
                        <span className="text-slate-400">Trace Route</span>
                        <span className="text-cyan-100">Masked</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/8 pb-2">
                        <span className="text-slate-400">Data Fragments</span>
                        <span className="text-white">476</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400">Index Nodes</span>
                        <span className="text-amber-100">899</span>
                    </div>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-cyan-200 via-sky-300 to-amber-200" />
                    <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)]" style={{ backgroundSize: '200% 100%' }} />
                </div>
            </div>
        </aside>
    );
}
