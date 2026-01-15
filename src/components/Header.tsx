import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="relative font-display font-bold text-2xl tracking-tight text-white group-hover:text-cyber-yellow transition-colors duration-200">
                        <span className="sr-only">TECH.BLOG</span>
                        <span aria-hidden="true" className="glitch-text">TECH.BLOG</span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">


                    <div className="flex items-center gap-2 px-3 py-1 border border-green-900/50 bg-green-900/10 rounded-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-mono text-green-500 tracking-wider">ONLINE</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
