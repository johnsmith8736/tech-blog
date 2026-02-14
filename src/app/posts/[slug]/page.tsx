
import Link from 'next/link';
import { getPostData, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import CodeCopyEnhancer from '@/components/CodeCopyEnhancer';

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const paths = getAllPostSlugs();
    return paths.map((path) => path.params);
}

export async function generateMetadata({ params }: PostPageProps) {
    const { slug } = await params;
    const postData = getPostData(slug);

    if (!postData) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: postData.title,
        description: postData.excerpt,
        alternates: {
            canonical: `/posts/${slug}`,
        },
        openGraph: {
            title: postData.title,
            description: postData.excerpt,
            type: 'article',
            publishedTime: postData.date,
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-blog.com";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": postData.title,
        "description": postData.excerpt,
        "datePublished": postData.date,
        "author": {
            "@type": "Person",
            "name": "Tech Blogger" // Replace with actual author
        },
        "url": `${baseUrl}/posts/${postData.slug}`,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CodeCopyEnhancer />
            <article className="mx-auto max-w-4xl py-10 md:py-12">

            {/**/}
            <header className="glass-panel edge-frame mb-10 space-y-4 p-6 md:p-8">
                <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.16em] text-cyan-200">
                    <time dateTime={postData.date}>{postData.date}</time>
                    <span>{/**/}{postData.category || 'TRANSMISSION'}</span>
                    <span>{/**/}ID: {slug.toUpperCase()}</span>
                </div>

                <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">
                    {postData.title}
                </h1>

                {postData.tags && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {postData.tags.map(tag => (
                            <span key={tag} className="rounded border border-cyan-300/35 bg-cyan-400/5 px-2 py-1 text-xs font-mono text-cyan-200">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {/* Content */}
            <div
                className="prose prose-invert prose-lg max-w-none 
        prose-headings:font-display prose-headings:text-white
        prose-p:font-mono prose-p:text-slate-300 prose-p:leading-loose
        prose-li:leading-loose
        prose-pre:bg-[#0f172a] prose-pre:border prose-pre:border-slate-600/40 prose-pre:p-4 prose-pre:my-12
        prose-code:font-mono prose-code:text-sm prose-code:leading-relaxed prose-code:tracking-wide
        prose-a:text-amber-200 hover:prose-a:text-cyan-200
        prose-blockquote:border-l-cyan-300 prose-blockquote:text-slate-400
        [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!text-sm"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
            />

            {/* Footer */}
            <div className="mt-16 border-t border-slate-600/30 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-mono text-slate-400 transition-colors hover:text-cyan-200"
                >
                    <span>←</span> RETURN_TO_ROOT
                </Link>
             </div>
         </article>
        </>
     );
 }
