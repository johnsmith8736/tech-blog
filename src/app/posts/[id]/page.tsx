import { getPostData, getAllPostIds } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map(path => ({ id: path.params.id }));
}

// Directly type the parameters for generateMetadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const postData = await getPostData(params.id);
  if (!postData) {
    return {};
  }
  return { title: postData.title };
}

// Directly type the parameters for PostPage
export default async function PostPage({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);

  if (!postData) {
    notFound();
  }

  return (
    <article className="prose prose-lg mx-auto dark:prose-invert">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tight">{postData.title}</h1>
        <div className="text-gray-500 dark:text-gray-400 mt-2">
          <time dateTime={postData.date}>{postData.date}</time>
        </div>
      </header>

      <div
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />

      <div className="mt-16 pt-6 border-t">
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          ← 返回首页
        </Link>
      </div>
    </article>
  );
}