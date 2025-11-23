import Image from 'next/image';
import SearchablePostList from '@/app/components/SearchablePostList';
import { Suspense } from 'react';
import { getSortedPostsData, PostData } from '@/lib/posts';
import Sidebar from '@/app/components/Sidebar';


export default async function HomePage() {
  // 直接获取文章数据（服务端渲染）
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
      {/* Left Sidebar - Author Info & System Status */}
      <Sidebar postCount={allPostsData.length} />

      {/* Main Content */}
      <main className="space-y-8">
        {/* Hero Section */}
        <section className="border border-border bg-secondary/30 p-8 clip-corner-both">
          <h1 className="text-xl md:text-2xl font-bold terminal-text mb-4 glitch" style={{ color: 'var(--cyber-yellow)' }}>
            LATEST TRANSMISSIONS
          </h1>
          <p className="text-sm terminal-text" style={{ color: 'var(--cyber-cyan)' }}>
            ENCRYPTED // PUBLIC KEY DETECTED
          </p>
        </section>

        {/* Posts Section */}
        <section>
          <Suspense fallback={
            <div className="grid grid-cols-1 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-border bg-secondary/30 p-6 clip-corner animate-pulse">
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
      </main>
    </div>
  );
}