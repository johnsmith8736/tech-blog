import Link from 'next/link';
import { getPostData, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.params.id,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const postData = getPostData(slug);

  if (!postData) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <time dateTime={postData.date}>
            {new Date(postData.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {postData.title}
        </h1>

        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
      </header>

      {/* Article Content */}
      <div className="relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10"></div>

        <div
          className="prose prose-lg mx-auto dark:prose-invert bg-background/30 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-border/40 shadow-sm"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
        />
      </div>

      {/* Footer / Navigation */}
      <div className="mt-16 pt-8 border-t border-border/40 flex justify-center">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
      </div>
    </article>
  );
}
