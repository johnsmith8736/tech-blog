'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
    return (
        <header className="fixed left-0 top-0 z-50 w-full border-b border-white/8 bg-slate-950/72 backdrop-blur-2xl">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="relative rounded-full border border-cyan-300/20 bg-slate-900/60 px-3 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-colors duration-200 group-hover:border-cyan-200/40">
                            <span className="sr-only">TECH.BLOG</span>
                            <span aria-hidden="true" className="font-display text-xl font-bold tracking-tight text-white">
                                TECH.<span className="accent-gradient-text">BLOG</span>
                            </span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-slate-400 xl:flex">
                        <span className="h-px w-8 bg-gradient-to-r from-cyan-300/0 via-cyan-300/60 to-cyan-300/0" />
                        <span>Signal archive</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <Link
                        href="/about"
                        className="hidden rounded-full border border-slate-500/30 bg-slate-900/45 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-cyan-300/60 hover:text-cyan-100 md:inline-flex"
                    >
                        About
                    </Link>

                    <div className="hidden sm:block">
                        <Suspense fallback={<div className="w-36 sm:w-44 lg:w-52" aria-hidden="true" />}>
                            <HeaderSearch />
                        </Suspense>
                    </div>

                    <div className="edge-frame flex items-center gap-2 border border-emerald-300/18 bg-emerald-900/18 px-3 py-1.5" aria-label="System Status: Online">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.22em] text-emerald-200">ONLINE</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
