'use client';

import Link from 'next/link';
import { useState } from 'react';
import CyberSidebar from './CyberSidebar';
import HeaderSearch from './HeaderSearch';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="relative font-display font-bold text-2xl tracking-tight text-white group-hover:text-cyber-yellow transition-colors duration-200">
                        <span className="sr-only">TECH.BLOG</span>
                        <span aria-hidden="true" className="glitch-text">TECH.BLOG</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <HeaderSearch />
                    </div>
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 hover:bg-white/5 rounded transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1 border border-green-900/50 bg-green-900/10 rounded-sm" aria-label="System Status: Online">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono text-green-500 tracking-wider">ONLINE</span>
                    </div>
                </div>

                {/* Mobile menu overlay */}
                {isMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMenuOpen(false)}>
                        <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-white/5 p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded"
                                aria-label="Close menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <CyberSidebar />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
