
import Link from 'next/link';
import { getAdjacentPosts, getAllPostSlugs, getPostData, getRelatedPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import CodeCopyEnhancer from '@/components/CodeCopyEnhancer';
import { getSectionLabel, getSubsectionLabel } from '@/lib/site-structure';
import type { Metadata } from 'next';
import { SITE_AUTHOR, SITE_NAME, toAbsoluteUrl } from '@/lib/site';

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const paths = getAllPostSlugs();
    return paths.map((path) => path.params);
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const postData = getPostData(slug);

    if (!postData) {
        return {
            title: 'Post Not Found',
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const canonicalUrl = `/posts/${slug}/`;

    return {
        title: postData.title,
        description: postData.excerpt,
        keywords: postData.tags,
        authors: [{ name: SITE_AUTHOR }],
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: postData.title,
            description: postData.excerpt,
            type: 'article',
            publishedTime: postData.date,
            url: toAbsoluteUrl(canonicalUrl),
            siteName: SITE_NAME,
            tags: postData.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: postData.title,
            description: postData.excerpt,
        },
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const postData = getPostData(slug);

    if (!postData) {
        notFound();
    }

    const canonicalPath = `/posts/${postData.slug}/`;
    const relatedPosts = getRelatedPosts(postData.slug, 3);
    const { newerPost, olderPost } = getAdjacentPosts(postData.slug);
    const sectionLabel = postData.section ? getSectionLabel(postData.section) : '';
    const subsectionLabel = postData.section && postData.subsection
        ? getSubsectionLabel(postData.section, postData.subsection)
        : '';
    const displayCategory = sectionLabel
        ? `${sectionLabel}${subsectionLabel ? ` / ${subsectionLabel}` : ''}`
        : (postData.category || 'TRANSMISSION');
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postData.title,
        "description": postData.excerpt,
        "datePublished": postData.date,
        "dateModified": postData.date,
        "mainEntityOfPage": toAbsoluteUrl(canonicalPath),
        "inLanguage": "en-US",
        "author": {
            "@type": "Person",
            "name": SITE_AUTHOR
        },
        "publisher": {
            "@type": "Person",
            "name": SITE_AUTHOR
        },
        "keywords": postData.tags?.join(", "),
        "articleSection": postData.category || sectionLabel || "Tech",
        "url": toAbsoluteUrl(canonicalPath),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CodeCopyEnhancer />
            <article className="mx-auto max-w-4xl py-10 md:py-12">
                <header className="glass-panel edge-frame panel-sheen relative mb-8 overflow-hidden p-6 md:p-8">
                    <div className="pointer-events-none absolute inset-0 soft-grid opacity-[0.06]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-yellow-300/70" />

                    <div className="relative space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
                            <span className="data-label text-[10px] text-cyan-100">transmission handshake // secure</span>
                            <span className="data-label text-[10px] text-slate-500">packet {slug.toUpperCase()}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 data-label text-[10px] text-slate-400">
                            <time dateTime={postData.date} className="text-cyan-100">{postData.date}</time>
                            <span className="text-slate-500">/</span>
                            <span className="text-slate-200">{displayCategory}</span>
                            {postData.readingTimeMinutes && (
                                <>
                                    <span className="text-slate-500">/</span>
                                    <span className="text-amber-100">{postData.readingTimeMinutes} min read</span>
                                </>
                            )}
                            <span className="text-slate-500">/</span>
                            <span>node active</span>
                        </div>

                        <h1 className="max-w-3xl glitch-text font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
                            {postData.title}
                        </h1>

                        {postData.excerpt && (
                            <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                                {postData.excerpt}
                            </p>
                        )}

                        {postData.tags && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {postData.tags.map((tag) => (
                                    <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 data-label text-[10px] text-slate-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-[1.15rem] border border-white/8 bg-slate-950/28 p-4">
                                <div className="data-label text-[10px] text-slate-500">signal type</div>
                                <div className="mt-2 font-display text-xl font-semibold text-cyan-100">article</div>
                            </div>
                            <div className="rounded-[1.15rem] border border-white/8 bg-slate-950/28 p-4">
                                <div className="data-label text-[10px] text-slate-500">route</div>
                                <div className="mt-2 font-display text-xl font-semibold text-white">{sectionLabel || 'net'}</div>
                            </div>
                            <div className="rounded-[1.15rem] border border-white/8 bg-slate-950/28 p-4">
                                <div className="data-label text-[10px] text-slate-500">status</div>
                                <div className="mt-2 font-display text-xl font-semibold text-yellow-100">decoded</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="glass-panel edge-frame relative overflow-hidden p-6 md:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,243,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,214,10,0.07),transparent_26%)]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-yellow-300/70" />

                    <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
                        <div>
                            <div className="data-label text-[10px] text-slate-400">transmission body</div>
                            <div className="data-label mt-1 text-[10px] text-cyan-100">decoded payload below</div>
                        </div>
                        <div className="data-label text-[10px] text-slate-500">scroll depth // live</div>
                    </div>

                    <div
                        className="post-content prose prose-invert prose-lg max-w-none
        prose-headings:font-display prose-headings:text-white prose-headings:tracking-tight
        prose-headings:scroll-mt-28 prose-h2:mt-14 prose-h2:mb-6 prose-h2:border-b prose-h2:border-cyan-300/12 prose-h2:pb-2
        prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-cyan-50
        prose-p:text-[15px] prose-p:leading-8 prose-p:text-slate-300
        prose-li:text-[15px] prose-li:leading-8 prose-li:text-slate-300
        prose-strong:text-white prose-hr:border-white/10
        prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-cyan-100
        prose-table:block prose-table:w-full prose-table:overflow-x-auto
        prose-th:border prose-th:border-cyan-300/12 prose-th:bg-cyan-300/[0.06] prose-th:px-3 prose-th:py-2 prose-th:text-left
        prose-td:border prose-td:border-white/8 prose-td:px-3 prose-td:py-2
        prose-img:rounded-2xl prose-img:border prose-img:border-cyan-300/10
        prose-pre:my-8 prose-pre:rounded-2xl prose-pre:border prose-pre:border-cyan-300/14 prose-pre:bg-[#0a0d15]
        prose-code:font-mono prose-code:text-sm prose-code:text-cyan-100
        prose-code:before:content-none prose-code:after:content-none
        prose-a:text-cyan-100 hover:prose-a:text-yellow-100
        prose-blockquote:border-l-cyan-200 prose-blockquote:bg-white/[0.02] prose-blockquote:py-1 prose-blockquote:text-slate-300
        [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!text-sm"
                        dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
                    />
                </div>

                {(postData.headings?.length || relatedPosts.length > 0) && (
                    <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
                        {postData.headings?.length ? (
                            <div className="glass-panel edge-frame overflow-hidden p-5">
                                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                                    <div className="data-label text-[10px] text-slate-400">signal map</div>
                                    <div className="data-label text-[10px] text-cyan-100">{postData.headings.length} anchors</div>
                                </div>

                                <div className="mt-4 grid gap-2">
                                    {postData.headings.map((heading, index) => (
                                        <a
                                            key={heading.id}
                                            href={`#${heading.id}`}
                                            className={`group flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 transition-colors hover:border-cyan-300/28 hover:bg-white/[0.045] ${
                                                heading.level === 3 ? 'ml-4' : ''
                                            }`}
                                        >
                                            <div className="min-w-0">
                                                <div className="data-label text-[10px] text-slate-500">
                                                    {String(index + 1).padStart(2, '0')} {'//'} h{heading.level}
                                                </div>
                                                <div className="mt-1 text-sm text-slate-200 transition-colors group-hover:text-white">
                                                    {heading.text}
                                                </div>
                                            </div>
                                            <span className="text-sm text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-100">→</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {relatedPosts.length > 0 ? (
                            <div className="glass-panel edge-frame overflow-hidden p-5">
                                <div className="flex items-center justify-between border-b border-white/8 pb-3">
                                    <div className="data-label text-[10px] text-slate-400">linked signals</div>
                                    <div className="data-label text-[10px] text-yellow-100">related traffic</div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.slug}
                                            href={`/posts/${relatedPost.slug}/`}
                                            className="group block rounded-[1.1rem] border border-white/8 bg-white/[0.025] p-4 transition-colors hover:border-yellow-300/26 hover:bg-white/[0.045]"
                                        >
                                            <div className="data-label text-[10px] text-slate-500">
                                                {relatedPost.date} / {relatedPost.readingTimeMinutes ?? 1} min
                                            </div>
                                            <div className="mt-2 text-base font-medium leading-7 text-slate-100 transition-colors group-hover:text-white">
                                                {relatedPost.title}
                                            </div>
                                            <div className="mt-2 text-sm text-slate-400">
                                                {relatedPost.excerpt}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </section>
                )}

                <div className="glass-panel edge-frame mt-8 overflow-hidden p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="data-label text-[10px] text-slate-400">transmission complete</div>
                            <div className="mt-1 text-sm text-slate-300">
                                Return to the archive or jump back into the indexed feed.
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {newerPost ? (
                                <Link
                                    href={`/posts/${newerPost.slug}/`}
                                    className="inline-flex items-center gap-2 rounded-full border border-yellow-300/18 bg-yellow-300/[0.05] px-4 py-2 data-label text-[10px] text-yellow-100 transition-colors hover:border-yellow-300/35 hover:text-white"
                                >
                                    <span>↑</span> newer_signal
                                </Link>
                            ) : null}
                            {olderPost ? (
                                <Link
                                    href={`/posts/${olderPost.slug}/`}
                                    className="inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[0.05] px-4 py-2 data-label text-[10px] text-amber-100 transition-colors hover:border-amber-200/30 hover:text-white"
                                >
                                    <span>↓</span> older_signal
                                </Link>
                            ) : null}
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/18 bg-cyan-300/[0.05] px-4 py-2 data-label text-[10px] text-cyan-100 transition-colors hover:border-yellow-300/35 hover:text-white"
                            >
                                <span>←</span> prev_sector
                            </Link>
                            <Link
                                href={canonicalPath}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 data-label text-[10px] text-slate-300 transition-colors hover:border-cyan-300/30 hover:text-white"
                            >
                                direct_link
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </>
     );
 }
