
import Image from 'next/image';

export default function CyberSidebar() {
    return (
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Profile Card */}
            <div className="relative p-6 border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                {/* Grid Background Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    {/* Header Section */}
                    <div className="flex gap-4">
                        <div className="w-16 h-16 border-2 border-cyber-yellow bg-white relative overflow-hidden shrink-0 group flex items-center justify-center">
                            <Image
                                src="/kali-logo.png"
                                alt="Kali Linux Avatar"
                                width={64}
                                height={64}
                                className="object-contain p-1"
                            />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl font-display font-bold text-white tracking-wide">Stanley Chan</h2>
                            <div className="text-sm font-mono text-cyber-yellow">@stanleychan87</div>
                            <div className="flex gap-2 mt-2 text-[10px] font-mono font-bold uppercase">
                                <span className="bg-[#ff003c] px-1.5 py-0.5 text-black">LVL 50</span>
                                <span className="border border-cyber-cyan text-cyber-cyan px-1.5 py-0.5">NETRUNNER</span>
                                <span className="border border-cyber-yellow text-cyber-yellow px-1 py-0.5 px-1.5">✉</span>
                            </div>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="pl-3 border-l-2 border-cyber-cyan">
                        <p className="font-mono text-xs text-gray-400 italic leading-relaxed">
                            &quot;Sorrow calls no time that&apos;s gone!&quot;
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                        <a
                            href="https://x.com/stanleychan87"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-mono border border-white/10 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors bg-white/5"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            X
                        </a>
                        <a
                            href="https://github.com/johnsmith8736"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-mono border border-white/10 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors bg-white/5"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </a>
                        <a
                            href="https://www.youtube.com/@stanleychan87"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-mono border border-white/10 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors bg-white/5"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            YouTube
                        </a>
                        <a
                            href="https://www.instagram.com/izumi.misaki87/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-mono border border-white/10 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors bg-white/5"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Instagram
                        </a>
                    </div>

                    {/* Stats Bars */}
                    <div className="space-y-3 font-mono text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-12 text-gray-500">RAM</span>
                            <div className="flex-1 h-2 bg-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-[64%] bg-cyber-yellow shadow-[0_0_10px_rgba(252,238,10,0.5)]" />
                            </div>
                            <span className="text-cyber-yellow w-8 text-right font-bold">64%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-12 text-gray-500">ICE</span>
                            <div className="flex-1 h-2 bg-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-[88%] bg-[#ff003c] shadow-[0_0_10px_rgba(255,0,60,0.5)]" />
                            </div>
                            <span className="text-[#ff003c] w-8 text-right font-bold">88%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-12 text-gray-500">UPLINK</span>
                            <div className="flex-1 h-2 bg-white/5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-[35%] bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                            </div>
                            <span className="text-cyber-cyan w-8 text-right font-bold">42MS</span>
                        </div>
                    </div>

                    {/* Neural Activity Graph */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="text-xs font-mono font-bold text-cyber-cyan uppercase tracking-wider mb-2">NEURAL ACTIVITY</div>
                        <div className="h-16 w-full relative overflow-hidden flex items-center">
                            <div className="animate-wave-scroll flex h-full absolute inset-0">
                                {/* First Copy */}
                                <svg className="w-1/2 h-full flex-shrink-0" viewBox="0 0 300 60" preserveAspectRatio="none">
                                    <path d="M0,40 Q10,30 20,40 T40,40 T60,20 T80,50 T100,30 T120,10 T140,40 T160,50 T180,30 T200,20 T220,45 T240,40 T260,30 T280,40 T300,40"
                                        fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M0,40 Q10,30 20,40 T40,40 T60,20 T80,50 T100,30 T120,10 T140,40 T160,50 T180,30 T200,20 T220,45 T240,40 T260,30 T280,40 T300,40"
                                        fill="none" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" opacity="0.1" />
                                </svg>
                                {/* Second Copy for Loop */}
                                <svg className="w-1/2 h-full flex-shrink-0" viewBox="0 0 300 60" preserveAspectRatio="none">
                                    <path d="M0,40 Q10,30 20,40 T40,40 T60,20 T80,50 T100,30 T120,10 T140,40 T160,50 T180,30 T200,20 T220,45 T240,40 T260,30 T280,40 T300,40"
                                        fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M0,40 Q10,30 20,40 T40,40 T60,20 T80,50 T100,30 T120,10 T140,40 T160,50 T180,30 T200,20 T220,45 T240,40 T260,30 T280,40 T300,40"
                                        fill="none" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" opacity="0.1" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Status Panel */}
            <div className="border border-white/5 p-5 bg-black/40 space-y-4 relative">
                {/* Decoration corner */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan" />

                <div className="text-xs font-mono font-bold text-[#ff003c] uppercase tracking-widest mb-4">SYSTEM STATUS</div>
                <div className="space-y-2 text-[10px] md:text-xs font-mono tracking-wide">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-gray-500">FIREWALL</span>
                        <span className="text-green-500 font-bold">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-gray-500">TRACE_ROUTE</span>
                        <span className="text-[#ff003c] font-bold">BLOCKED</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                        <span className="text-gray-500">DATA_FRAGMENTS</span>
                        <span className="text-cyber-cyan font-bold">476</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                        <span className="text-gray-500">INDEX_NODES</span>
                        <span className="text-cyber-yellow font-bold">899</span>
                    </div>
                </div>
                <div className="h-1.5 w-full bg-gray-900 mt-4 overflow-hidden relative">
                    <div className="h-full w-[75%] bg-cyber-yellow" />
                    {/* Scanline effect on bar */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                </div>
            </div>
        </aside>
    );
}
