'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPostData } from '@/lib/posts';

interface PostData {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  contentHtml: string;
}

function PostContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const post = await getPostData(slug);
        if (!post) {
          setNotFound(true);
        } else {
          setPostData(post);
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">加载文章中...</p>
      </div>
    );
  }

  if (notFound || !postData) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">文章未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">抱歉，您访问的文章不存在。</p>
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          ← 返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="prose prose-lg mx-auto dark:prose-invert leading-relaxed">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-tight">{postData.title}</h1>
        <div className="text-gray-500 dark:text-gray-400 mt-2">
          <time dateTime={postData.date}>{postData.date}</time>
        </div>
      </header>

      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

      <div className="mt-16 pt-6 border-t">
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
          ← 返回首页
        </Link>
      </div>
    </article>
  );
}

export default function PostPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    }>
      <PostContent />
    </Suspense>
  );
}
