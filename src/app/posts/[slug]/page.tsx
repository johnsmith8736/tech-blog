
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-blog.com';

    return {
        title: postData.title,
        description: postData.excerpt,
        alternates: {
            canonical: `${baseUrl}/posts/${slug}`,
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-blog.com'; // Replace with your actual domain
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
            <article className="max-w-4xl mx-auto py-12">

            {/**/}
            <header className="mb-12 space-y-4 border-b border-white/10 pb-8">
                <div className="flex items-center gap-4 text-xs font-mono text-cyber-cyan uppercase tracking-wider">
                    <time dateTime={postData.date}>{postData.date}</time>
                    <span>{/**/}{postData.category || 'TRANSMISSION'}</span>
                    <span>{/**/}ID: {slug.toUpperCase()}</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                    {postData.title}
                </h1>

                {postData.tags && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {postData.tags.map(tag => (
                            <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-cyber-blue/10 text-cyber-blue">
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
        prose-p:font-mono prose-p:text-gray-300 prose-p:leading-loose
        prose-li:leading-loose
        prose-pre:bg-[#1a1b26] prose-pre:border prose-pre:border-white/10 prose-pre:p-4 prose-pre:my-12
        prose-code:font-mono prose-code:text-sm prose-code:leading-relaxed prose-code:tracking-wide
        prose-a:text-cyber-yellow hover:prose-a:text-cyber-cyan
        prose-blockquote:border-l-cyber-cyan prose-blockquote:text-gray-400
        [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!text-sm"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
            />

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-white/10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-mono text-gray-500 hover:text-cyber-cyan transition-colors"
                >
                    <span>←</span> RETURN_TO_ROOT
                </Link>
             </div>
         </article>
        </>
     );
 }
