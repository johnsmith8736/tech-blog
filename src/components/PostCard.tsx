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
        <article className="group relative overflow-hidden rounded-[1.35rem] border border-cyan-300/12 bg-white/[0.025] shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-300/28 hover:bg-white/[0.045]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(98,243,255,0.14),transparent_32%),linear-gradient(120deg,rgba(255,255,255,0.03),transparent_40%,rgba(255,214,10,0.07))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-yellow-300/70" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-cyan-200/0 via-cyan-200/70 to-yellow-300/0" />

            <Link href={`/posts/${post.slug}`} className="relative block p-5 md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/8 pb-3">
                    <span className="data-label text-[10px] text-cyan-100">encrypted // public node detected</span>
                    <span className="data-label text-[10px] text-slate-500">sector ready</span>
                </div>

                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                    <div className="flex items-center justify-between gap-3 md:w-40 md:flex-col md:items-start md:justify-start md:gap-2">
                        <time
                            dateTime={post.date}
                            className="data-label text-[10px] text-slate-400 md:text-xs"
                        >
                            {post.date}
                        </time>
                        <div className="flex flex-wrap gap-2 md:flex-col md:items-start">
                            <span className="rounded-full border border-cyan-300/16 bg-cyan-300/[0.06] px-2.5 py-1 data-label text-[10px] text-cyan-100">
                                transmission
                            </span>
                            {post.readingTimeMinutes && (
                                <span className="rounded-full border border-amber-200/15 bg-amber-200/[0.06] px-2.5 py-1 data-label text-[10px] text-amber-100">
                                    {post.readingTimeMinutes} min read
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-200/20 bg-cyan-200/[0.06] px-2.5 py-1 data-label text-[10px] text-cyan-100">
                                {displayCategory}
                            </span>

                            {post.tags && post.tags.length > 0 && post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 data-label text-[10px] text-slate-300 transition-colors group-hover:border-white/20 group-hover:text-white"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <h2 className="max-w-3xl font-display text-2xl font-semibold leading-tight text-white transition-colors duration-200 group-hover:text-cyan-100 md:text-[2rem]">
                            {post.title}
                        </h2>

                        {post.excerpt && (
                            <p className="max-w-3xl line-clamp-2 text-sm leading-7 text-slate-300 md:text-[15px]">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 pt-1 data-label text-[10px] text-slate-500">
                            <span>packet {String(post.id).padStart(3, '0')}</span>
                            <span>||</span>
                            <span>open sector</span>
                        </div>
                    </div>

                    <div className="hidden flex-shrink-0 items-center text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-100 md:flex">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                        </svg>
                    </div>
                </div>
            </Link>
        </article>
    );
}
