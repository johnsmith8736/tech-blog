import Link from 'next/link';
import React from 'react';

interface GlitchLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const GlitchLink: React.FC<GlitchLinkProps> = ({ href, children, className = '', onClick }) => {
    const content = children;

    return (
        <Link
            href={href}
            className={`relative inline-block group font-mono transition-all hover:text-neon-cyan text-foreground ${className}`}
            onClick={onClick}
        >
            <span className="relative z-10 transition-all duration-300 block">
                {content}
            </span>
        </Link>
    );
};

export default GlitchLink;
