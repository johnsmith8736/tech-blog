import { getSortedPostsData, PostData } from '@/lib/posts';
import FilteredPostList from '@/components/FilteredPostList';

export default async function HomePage() {
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <div className="space-y-0">
      <div className="mb-12 border-b border-white/10 pb-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          TRANSMISSIONS
        </h1>

      </div>

      <FilteredPostList allPostsData={allPostsData} />

      {allPostsData.length === 0 && (
        <div className="py-12 text-center font-mono text-gray-500">
          {/**/}NO TRANSMISSIONS FOUND. SYSTEM STANDBY.
        </div>
      )}
    </div>
  );
}
