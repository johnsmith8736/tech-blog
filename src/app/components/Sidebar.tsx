"use client";

import Image from 'next/image';
import CyberStats from '@/app/components/CyberStats';

interface SidebarProps {
    postCount?: number;
}

export default function Sidebar({ postCount = 0 }: SidebarProps) {
    return (
        <aside className="space-y-6">
            {/* Author Card */}
            <div className="border border-border bg-secondary/50 p-6 clip-corner">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-yellow to-cyber-cyan rounded-full opacity-50 blur"></div>
                        <Image
                            src="/avatar.jpg"
                            alt="Stanley Chan"
                            width={80}
                            height={80}
                            className="relative rounded-full ring-2 ring-background"
                            priority
                        />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold terminal-text" style={{ color: 'var(--cyber-yellow)' }}>
                            STANLEY CHAN
                        </h2>
                        <a
                            href="https://github.com/johnsmith8736"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs terminal-text hover:text-cyber-cyan transition-colors"
                            style={{ color: 'var(--cyber-cyan)' }}
                        >
                            @StanleyChan
                        </a>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                        &quot;Sorrow calls no time that&apos;s gone&quot;
                    </p>
                </div>
            </div>

            {/* System Status */}
            <div className="border border-border bg-secondary/50 p-4 clip-corner">
                <h3 className="text-xs font-bold terminal-text mb-4" style={{ color: 'var(--cyber-cyan)' }}>
                    SYSTEM STATUS
                </h3>
                <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">RAM</span>
                        <span style={{ color: 'var(--cyber-yellow)' }}>87%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ICE</span>
                        <span style={{ color: 'var(--cyber-cyan)' }}>ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">UPLINK</span>
                        <span className="text-green-400">STABLE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">POSTS</span>
                        <span style={{ color: 'var(--cyber-yellow)' }}>{postCount}</span>
                    </div>
                </div>
            </div>

            {/* Cyber Stats (Charts) */}
            <CyberStats />

            {/* Neural Activity */}
            <div className="border border-border bg-secondary/50 p-4 clip-corner">
                <h3 className="text-xs font-bold terminal-text mb-4" style={{ color: 'var(--cyber-cyan)' }}>
                    NEURAL ACTIVITY
                </h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyber-yellow rounded-full animate-pulse"></span>
                        <span>SCANNING FEEDS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                        <span>PROCESSING DATA</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
                        <span>ONLINE</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
