import Link from 'next/link';
import { PostData } from '@/lib/posts';
import { getSectionLabel, getSubsectionLabel } from '@/lib/site-structure';

interface PostCardProps {
    post: PostData;
}

export default function PostCard({ post }: PostCardProps) {
    const sectionLabel = post.section ? getSectionLabel(post.section) : '';
    const subsectionLabel = post.section && post.subsection
        ? getSubsectionLabel(post.section, post.subsection)
        : '';
    const displayCategory = sectionLabel
        ? `${sectionLabel}${subsectionLabel ? ` / ${subsectionLabel}` : ''}`
        : (post.category || 'TRANSMISSION');

    return (
        <article className="group relative overflow-hidden rounded-[1.15rem] border border-white/8 bg-slate-950/38 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-950/58">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.12),transparent_30%),linear-gradient(120deg,rgba(94,234,212,0.06),transparent_40%,rgba(245,158,11,0.05))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-cyan-300/0 via-cyan-200/70 to-amber-300/0" />

            <Link href={`/posts/${post.slug}`} className="relative block p-5 md:p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                    <div className="flex items-center justify-between gap-3 md:w-36 md:flex-col md:items-start md:justify-start md:gap-2">
                        <time
                            dateTime={post.date}
                            className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400 md:text-xs"
                        >
                            {post.date}
                        </time>
                        <span className="rounded-full border border-slate-500/25 bg-slate-900/55 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-300">
                            Transmission
                        </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/6 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-100">
                                {displayCategory}
                            </span>

                            {post.tags && post.tags.length > 0 && post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-slate-500/20 bg-slate-900/45 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-300 transition-colors group-hover:border-slate-400/40 group-hover:text-cyan-100"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <h2 className="max-w-3xl font-display text-2xl font-bold leading-tight text-white transition-colors duration-200 group-hover:text-cyan-100 md:text-3xl">
                            {post.title}
                        </h2>

                        {post.excerpt && (
                            <p className="max-w-3xl line-clamp-2 text-sm leading-7 text-slate-300 md:text-[15px]">
                                {post.excerpt}
                            </p>
                        )}
                    </div>

                    <div className="hidden flex-shrink-0 items-center text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-amber-200 md:flex">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                        </svg>
                    </div>
                </div>
            </Link>
        </article>
    );
}
