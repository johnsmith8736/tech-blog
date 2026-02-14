'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
    return (
        <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-600/25 bg-slate-950/75 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="relative font-display text-2xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-cyan-200">
                        <span className="sr-only">TECH.BLOG</span>
                        <span aria-hidden="true" className="glitch-text">
                            TECH.<span className="accent-gradient-text">BLOG</span>
                        </span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <Suspense fallback={<div className="w-36 sm:w-44 lg:w-52" aria-hidden="true" />}>
                            <HeaderSearch />
                        </Suspense>
                    </div>

                    <div className="edge-frame flex items-center gap-2 bg-emerald-900/20 px-3 py-1.5" aria-label="System Status: Online">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono tracking-[0.16em] text-emerald-300">ONLINE</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
