import Link from 'next/link';
import { PostData } from '@/lib/posts';

interface PostCardProps {
    post: PostData;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="group relative mb-4 w-full overflow-hidden rounded-sm border border-slate-600/20 bg-slate-900/35 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/35 hover:bg-slate-900/70">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(94,234,212,0.08),transparent_45%,rgba(245,158,11,0.08))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Link href={`/posts/${post.slug}`} className="relative block px-4 py-6 md:px-6 md:py-7">
                <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                    {/* Date Column */}
                    <div className="mb-3 w-32 flex-shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-slate-400 md:mb-0 md:text-sm">
                        {post.date}
                    </div>

                    {/* Content Column */}
                    <div className="flex-grow space-y-2">
                        <h2 className="font-display text-xl font-bold text-slate-100 transition-colors duration-200 group-hover:text-amber-200 md:text-2xl">
                            {post.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wide text-slate-400 md:gap-4">
                            <span>{/**/}{post.category || 'TRANSMISSION'}</span>

                            {post.tags && post.tags.length > 0 && (
                                <>
                                    <span className="text-slate-600">|</span>
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-sky-300 transition-colors group-hover:text-cyan-200">
                                            #{tag}
                                        </span>
                                    ))}
                                </>
                            )}
                        </div>

                        {post.excerpt && (
                            <p className="mt-3 max-w-3xl line-clamp-2 font-mono text-sm leading-relaxed text-slate-300 md:text-base">
                                {post.excerpt}
                            </p>
                        )}
                    </div>

                    {/* Arrow / Decoration */}
                    <div className="hidden flex-shrink-0 text-slate-600 transition-colors duration-200 group-hover:text-amber-200 md:flex">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                        </svg>
                    </div>
                </div>
            </Link>
        </article>
    );
}
