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
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        {/* Modern Grid Background */}
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-20"></div>

        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-4xl mx-auto space-y-8 px-4">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-75 group-hover:opacity-100 blur-lg transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <Image
                src="/avatar.jpg"
                alt="Stanley Chan"
                width={120}
                height={120}
                className="relative rounded-full ring-4 ring-background shadow-2xl transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent animate-gradient">
              分享技术，探索未来
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            欢迎来到我的技术博客。这里汇集了关于 <span className="text-primary font-semibold">Python 爬虫</span>、
            <span className="text-accent font-semibold">网络安全</span> 以及前沿计算机技术的深度探索。
            <br className="hidden md:block" />
            让我们一起在代码的世界里不断精进。
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-8">
            {['Python 爬虫', '网络安全', '全栈开发', '系统架构'].map((tag, index) => (
              <span
                key={tag}
                className="px-5 py-2.5 bg-background/50 backdrop-blur-md border border-border text-foreground rounded-full text-sm font-medium hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300 cursor-default hover:scale-105 shadow-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tag}
              </span>
            ))}
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
          {/* <div className="text-center">SearchablePostList temporarily disabled for debugging</div> */}
        </Suspense>
      </section>
    </div>
  );
}