import Link from 'next/link';
import { PostData } from '@/lib/posts';

interface PostCardProps {
    post: PostData;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="group relative w-full border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-300">
            <Link href={`/posts/${post.slug}`} className="block px-4 py-6 md:px-8 md:py-8">
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                    {/* Date Column */}
                    <div className="flex-shrink-0 font-mono text-xs md:text-sm text-gray-500 mb-2 md:mb-0 w-32">
                        {post.date}
                    </div>

                    {/* Content Column */}
                    <div className="flex-grow space-y-2">
                        <h2 className="text-xl md:text-2xl font-display font-bold text-gray-200 group-hover:text-cyber-yellow transition-colors duration-200">
                            {post.title}
                        </h2>

                        <div className="flex flex-wrap gap-2 md:gap-4 items-center text-xs font-mono text-gray-500 uppercase tracking-wide">
                            <span>// {post.category || 'TRANSMISSION'}</span>

                            {post.tags && post.tags.length > 0 && (
                                <>
                                    <span className="text-gray-700">|</span>
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-cyber-blue group-hover:text-cyber-cyan transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </>
                            )}
                        </div>

                        {post.excerpt && (
                            <p className="font-mono text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl mt-3 line-clamp-2">
                                {post.excerpt}
                            </p>
                        )}
                    </div>

                    {/* Arrow / Decoration */}
                    <div className="hidden md:flex flex-shrink-0 text-gray-700 group-hover:text-cyber-yellow transition-colors duration-200">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                        </svg>
                    </div>
                </div>
            </Link>
        </article>
    );
}
