import Image from 'next/image';
import SearchablePostList from '@/app/components/SearchablePostList';
import { Suspense } from 'react';
import { getSortedPostsData, PostData } from '@/lib/posts';



export default async function HomePage() {
  // 直接获取文章数据（服务端渲染）
  const allPostsData: PostData[] = getSortedPostsData();
  const totalPages = Math.ceil(allPostsData.length / 10);
  const currentPage = 1;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="space-y-4">
        <h1 className="text-2xl font-mono font-bold text-neon-cyan uppercase tracking-wider">
          LATEST TRANSMISSIONS
        </h1>
        <div className="space-y-2 text-xs font-mono">
          <p className="text-neon-cyan">ENCRYPTED // PUBLIC KEY DETECTED</p>
          <div className="flex items-center gap-2">
            <span className="text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              ONLINE
            </span>
          </div>

        </div>
      </section>

      {/* Posts Section */}
      <section>
        <Suspense fallback={
          <div className="grid grid-cols-1 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-neon-cyan/20 bg-background/50 p-6 animate-pulse">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="flex items-center justify-between pt-8 border-t border-neon-cyan/20">
          <button
            className="text-xs font-mono text-muted-foreground hover:text-neon-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            PREV_SECTOR
          </button>
          <span className="text-xs font-mono text-neon-cyan">
            PAGE {currentPage} / {totalPages}
          </span>
          <button
            className="text-xs font-mono text-muted-foreground hover:text-neon-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            NEXT_SECTOR
          </button>
        </section>
      )}
    </div>
  );
}