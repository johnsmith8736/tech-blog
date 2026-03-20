
import Link from 'next/link';
import { getPostData, getAllPostSlugs } from '@/lib/posts';
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
                <header className="glass-panel edge-frame panel-sheen mb-10 space-y-5 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                        <time dateTime={postData.date} className="text-cyan-100">{postData.date}</time>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-200">{displayCategory}</span>
                        <span className="text-slate-500">/</span>
                        <span>ID: {slug.toUpperCase()}</span>
                    </div>

                    <h1 className="max-w-3xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
                        {postData.title}
                    </h1>

                    {postData.excerpt && (
                        <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                            {postData.excerpt}
                        </p>
                    )}

                    {postData.tags && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {postData.tags.map((tag) => (
                                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-slate-200">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <div
                    className="post-content prose prose-invert prose-lg max-w-none
        prose-headings:font-display prose-headings:text-white prose-headings:tracking-tight
        prose-headings:scroll-mt-28 prose-h2:mt-14 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
        prose-h3:mt-10 prose-h3:mb-4
        prose-p:text-[15px] prose-p:leading-8 prose-p:text-slate-300
        prose-li:text-[15px] prose-li:leading-8 prose-li:text-slate-300
        prose-strong:text-white prose-hr:border-white/10
        prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-cyan-100
        prose-table:block prose-table:w-full prose-table:overflow-x-auto
        prose-th:border prose-th:border-white/10 prose-th:bg-white/[0.05] prose-th:px-3 prose-th:py-2 prose-th:text-left
        prose-td:border prose-td:border-white/8 prose-td:px-3 prose-td:py-2
        prose-img:rounded-2xl prose-img:border prose-img:border-white/10
        prose-pre:my-8 prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10
        prose-code:font-mono prose-code:text-sm prose-code:text-cyan-100
        prose-code:before:content-none prose-code:after:content-none
        prose-a:text-cyan-100 hover:prose-a:text-white
        prose-blockquote:border-l-cyan-200 prose-blockquote:text-slate-300
        [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!text-sm"
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
                />

                <div className="mt-16 border-t border-white/10 pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-mono text-slate-400 transition-colors hover:text-cyan-100"
                    >
                        <span>←</span> Return to root
                    </Link>
                </div>
            </article>
        </>
     );
 }
