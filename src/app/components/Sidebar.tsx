"use client";

import GlitchLink from './GlitchLink';
import Image from 'next/image';

interface SidebarProps {
    postCount?: number;
}

export default function Sidebar({ postCount = 0 }: SidebarProps) {
    // 模拟动态系统状态
    const ram = 64;
    const ice = 88;
    const uplink = 42;

    return (
        <aside className="w-80 h-screen lg:sticky lg:top-0 overflow-y-auto border-r border-neon-cyan/30 bg-background/98 backdrop-blur-xl flex flex-col p-8 z-50 hidden lg:flex crt-scanlines relative">
            {/* Sidebar glow effect */}
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-pink opacity-40"></div>

            {/* All content tightly packed */}
            <div className="space-y-3">
                {/* Navigation */}
                <nav className="space-y-0 border border-neon-cyan/30 p-2">
                    <GlitchLink href="/" className="block py-0.5 text-sm font-mono">FEED</GlitchLink>
                </nav>

                {/* Profile Section */}
                <div className="space-y-1.5 border border-neon-cyan/30 p-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded border-2 border-neon-cyan/50 bg-neon-cyan/10 flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-neon-cyan/20"></div>
                            <Image
                                src="/kali-logo.png"
                                alt="Avatar"
                                width={48}
                                height={48}
                                className="object-contain relative z-10 p-1"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-neon-cyan text-xs font-mono">KALI</div>';
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-sm font-mono font-bold text-neon-cyan">Stanley Chan</h2>
                            <p className="text-xs font-mono text-muted-foreground">@stanleychan87</p>
                        </div>
                    </div>
                    <div className="text-xs font-mono">
                        <div className="text-neon-cyan">LVL 50</div>
                        <div className="text-neon-pink">NETRUNNER</div>
                    </div>
                    <p className="text-xs font-mono text-foreground/70 italic leading-relaxed">
                        &ldquo;Sorrow calls no time that&apos;s gone!&rdquo;
                    </p>
                    <div className="flex gap-3 mt-2">
                        <a
                            href="https://github.com/johnsmith8736"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-neon-cyan hover:text-neon-pink transition-colors inline-flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GITHUB
                        </a>
                        <a
                            href="https://x.com/stanleychan87"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-neon-cyan hover:text-neon-pink transition-colors inline-flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            X
                        </a>
                        <a
                            href="https://www.youtube.com/@stanleychan87"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-neon-cyan hover:text-neon-pink transition-colors inline-flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 15l5-3-5-3v6zM21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9z" />
                            </svg>
                            YOUTUBE
                        </a>
                    </div>
                </div>

                {/* System Stats */}
                <div className="space-y-1 text-xs font-mono border border-neon-cyan/30 p-2">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">RAM</span>
                        <span className="text-neon-cyan">{ram}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">ICE</span>
                        <span className="text-neon-pink">{ice}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">UPLINK</span>
                        <span className="text-neon-cyan">{uplink}MS</span>
                    </div>
                </div>

                {/* NEURAL ACTIVITY and NAVIGATION */}
                <div className="space-y-2 border border-neon-cyan/30 p-2 relative overflow-hidden">
                    {/* Neural Activity Visual Effect */}
                    <div className="mb-2 h-12 relative">
                        <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.8" />
                                    <stop offset="50%" stopColor="var(--neon-pink)" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M 0,20 Q 25,10 50,20 T 100,20 T 150,20 T 200,20"
                                fill="none"
                                stroke="url(#neuralGradient)"
                                strokeWidth="2"
                                className="neural-wave-1"
                            />
                            <path
                                d="M 0,20 Q 30,30 60,20 T 120,20 T 180,20"
                                fill="none"
                                stroke="url(#neuralGradient)"
                                strokeWidth="1.5"
                                opacity="0.6"
                                className="neural-wave-2"
                            />
                            <path
                                d="M 0,20 Q 20,5 40,20 T 80,20 T 120,20 T 160,20 T 200,20"
                                fill="none"
                                stroke="url(#neuralGradient)"
                                strokeWidth="1"
                                opacity="0.4"
                                className="neural-wave-3"
                            />
                        </svg>
                        {/* Pulse dots */}
                        <div className="absolute inset-0 flex items-center justify-between px-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 h-1 rounded-full bg-neon-cyan animate-pulse"
                                    style={{
                                        animationDelay: `${i * 0.3}s`,
                                        animationDuration: '1.5s',
                                        boxShadow: `0 0 ${3 + i}px rgba(0, 240, 255, 0.8)`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <h3 className="text-xs font-mono font-bold text-neon-cyan uppercase tracking-widest">
                        NEURAL ACTIVITY
                    </h3>
                </div>

                {/* System Status */}
                <div className="space-y-1.5 border border-neon-cyan/30 p-2">
                    <h3 className="text-xs font-mono font-bold text-neon-cyan uppercase tracking-widest">
                        SYSTEM STATUS
                    </h3>
                    <div className="space-y-1 text-[10px] font-mono">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">FIREWALL</span>
                            <span className="text-green-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                ACTIVE
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">TRACE_ROUTE</span>
                            <span className="text-green-400">BLOCKED</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">DATA_FRAGMENTS</span>
                            <span className="text-neon-cyan">0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">INDEX_NODES</span>
                            <span className="text-neon-cyan">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
