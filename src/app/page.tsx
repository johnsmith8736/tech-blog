import Image from 'next/image';
import SearchablePostList from '@/app/components/SearchablePostList';
import { Suspense } from 'react';
import { getSortedPostsData, PostData } from '@/lib/posts';

export default async function HomePage() {
  // 直接获取文章数据（服务端渲染）
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center mb-8">
            <Image 
              src="/avatar.jpg" 
              alt="Stanley Chan" 
              width={120} 
              height={120} 
              className="rounded-full ring-4 ring-border shadow-lg" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            分享技术，探索未来
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            欢迎来到我的技术博客。我在这里分享关于 Python 爬虫、网络安全和各种计算机技术的深度文章，
            希望能帮助你在技术路上走得更远。
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
              Python 爬虫
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
              网络安全
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
              计算机技术
            </span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
              技术分享
            </span>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">最新文章</h2>
          <p className="text-muted-foreground">共 {allPostsData.length} 篇文章</p>
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded mb-2 w-24"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <SearchablePostList allPostsData={allPostsData} />
        </Suspense>
      </section>
    </div>
  );
}