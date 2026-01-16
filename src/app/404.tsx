import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-display font-bold text-cyber-cyan">404</h1>
                <h2 className="text-2xl font-mono text-white">TRANSMISSION NOT FOUND</h2>
                <p className="text-gray-400 font-mono">The requested data fragment does not exist in our system.</p>
                <Link href="/" className="inline-block px-6 py-2 bg-cyber-blue text-black font-mono uppercase tracking-wide hover:bg-cyber-cyan transition-colors">
                    RETURN_TO_ROOT
                </Link>
            </div>
        </div>
    );
}