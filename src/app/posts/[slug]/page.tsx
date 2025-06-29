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
    <article className="prose prose-lg mx-auto dark:prose-invert leading-relaxed">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tight">{postData.title}</h1>
        <div className="text-gray-500 dark:text-gray-400 mt-2">
          <time dateTime={postData.date}>{postData.date}</time>
        </div>
      </header>

      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }} />

      <div className="mt-16 pt-6 border-t">
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          ← 返回首页
        </Link>
      </div>
    </article>
  );
}
