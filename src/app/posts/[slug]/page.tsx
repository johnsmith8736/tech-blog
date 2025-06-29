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
    <article className="prose prose-lg mx-auto dark:prose-invert leading-relaxed prose-green">
      <header className="mb-8 border-b border-green-200 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-green-600">{postData.title}</h1>
        <div className="text-green-500 dark:text-green-400 mt-2">
          <time dateTime={postData.date}>{postData.date}</time>
        </div>
      </header>

      <div className="text-green-600 dark:text-green-300" dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} />

      <div className="mt-16 pt-6 border-t border-green-200">
        <Link href="/" className="text-green-600 hover:underline dark:text-green-400">
          ← 返回首页
        </Link>
      </div>
    </article>
  );
}
