import Link from 'next/link';

export default function ErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-display font-bold text-cyber-yellow">500</h1>
                <h2 className="text-2xl font-mono text-white">SYSTEM ERROR</h2>
                <p className="text-gray-400 font-mono">An internal system error has occurred. Please try again later.</p>
                <Link href="/" className="inline-block px-6 py-2 bg-cyber-blue text-black font-mono uppercase tracking-wide hover:bg-cyber-cyan transition-colors">
                    RETURN_TO_ROOT
                </Link>
            </div>
        </div>
    );
}