import Link from 'next/link';
import { getPostData, getAllPostPaths, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllPostPaths();
  return paths.map((path) => path.params);
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { slug } = await params;
    const postData = getPostData(slug);

    if (!postData) {
      console.error(`Post not found: ${slug}`);
      notFound();
    }

    // 安全地解析日期
    let formattedDate = postData.date;
    try {
      const date = new Date(postData.date);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (e) {
      console.error('Date parsing error:', e);
    }

    return (
      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <div className="text-xs font-mono text-neon-cyan">
            <time dateTime={postData.date}>{formattedDate}</time>
          </div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold text-foreground leading-tight">
            {postData.title}
          </h1>
        </header>

        {/* Article Content */}
        <div className="relative">
          <div
            className="prose prose-lg mx-auto dark:prose-invert border border-neon-cyan/20 bg-background/30 p-6 md:p-8"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
          />
        </div>

        {/* Footer / Navigation */}
        <div className="mt-12 pt-6 border-t border-neon-cyan/20 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 border border-neon-cyan/50 bg-background/50 text-neon-cyan font-mono text-xs hover:border-neon-cyan hover:bg-background/70 transition-all duration-300 uppercase tracking-wider"
          >
            <svg
              className="w-3 h-3 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK
          </Link>
        </div>
      </article>
    );
  } catch (error) {
    console.error('Error rendering post page:', error);
    notFound();
  }
}
