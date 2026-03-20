'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
    return (
        <header className="fixed left-0 top-0 z-50 w-full border-b border-white/8 bg-slate-950/58 backdrop-blur-2xl">
            <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="edge-frame panel-sheen relative overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.22)] transition-all duration-200 group-hover:border-cyan-200/30 group-hover:bg-white/[0.06]">
                            <span className="sr-only">TECH.BLOG</span>
                            <span aria-hidden="true" className="font-display text-[1.05rem] font-semibold tracking-[0.22em] text-white">
                                TECH.<span className="accent-gradient-text">BLOG</span>
                            </span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-slate-400 xl:flex">
                        <span className="h-px w-8 bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-cyan-300/0" />
                        <span>Curated archive</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/about"
                        className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-300 transition-colors hover:border-cyan-200/40 hover:bg-white/[0.06] hover:text-white md:inline-flex"
                    >
                        About
                    </Link>

                    <div className="hidden sm:block">
                        <Suspense fallback={<div className="w-36 sm:w-44 lg:w-52" aria-hidden="true" />}>
                            <HeaderSearch />
                        </Suspense>
                    </div>

                    <div className="edge-frame flex items-center gap-2 rounded-full border border-cyan-200/12 bg-cyan-200/[0.05] px-3 py-2 backdrop-blur-sm" aria-label="System Status: Online">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.22em] text-emerald-100">ONLINE</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
