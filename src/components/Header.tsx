'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
    return (
        <header className="terminal-rule fixed left-0 top-0 z-50 w-full border-b border-yellow-300/10 bg-[#090a11]/78 backdrop-blur-2xl">
            <div className="mx-auto flex h-[4.75rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="edge-frame panel-sheen relative overflow-hidden rounded-full border border-yellow-300/15 bg-yellow-300/[0.05] px-3.5 py-2 shadow-[0_0_0_1px_rgba(255,214,10,0.06),0_18px_42px_rgba(0,0,0,0.28)] transition-all duration-200 group-hover:border-cyan-300/35 group-hover:bg-yellow-300/[0.09]">
                            <span className="sr-only">TECH.BLOG</span>
                            <span aria-hidden="true" className="glitch-text font-display text-[1.05rem] font-semibold tracking-[0.28em] text-white">
                                NIGHT.<span className="accent-gradient-text">ARCHIVE</span>
                            </span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-3 xl:flex">
                        <span className="h-px w-8 bg-gradient-to-r from-yellow-300/0 via-yellow-300/80 to-cyan-300/50" />
                        <nav className="flex items-center gap-3 data-label text-[10px] text-slate-400">
                            <Link href="/" className="transition-colors hover:text-yellow-100">stream</Link>
                            <Link href="/?section=networking" className="transition-colors hover:text-yellow-100">relays</Link>
                            <Link href="/?section=python" className="transition-colors hover:text-yellow-100">scripts</Link>
                            <Link href="/?section=linux" className="transition-colors hover:text-yellow-100">systems</Link>
                        </nav>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/about"
                        className="hidden rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 data-label text-[10px] text-slate-300 transition-colors hover:border-yellow-300/40 hover:bg-yellow-300/[0.08] hover:text-white md:inline-flex"
                    >
                        dossier
                    </Link>

                    <div className="hidden sm:block">
                        <Suspense fallback={<div className="w-36 sm:w-44 lg:w-52" aria-hidden="true" />}>
                            <HeaderSearch />
                        </Suspense>
                    </div>

                    <div className="edge-frame flex items-center gap-2 rounded-full border border-yellow-300/15 bg-yellow-300/[0.06] px-3 py-2 backdrop-blur-sm" aria-label="System Status: Online">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_12px_rgba(255,214,10,0.8)]" />
                        </span>
                        <span className="data-label text-[10px] text-yellow-100">channel stable</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
