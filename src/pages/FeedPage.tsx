import { useSearchParams } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta';
import { PostList } from '../components/PostList';
import { onlinePosts } from '../data/posts';

export function FeedPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') ?? '').trim().toLowerCase();

  const visiblePosts = query
    ? onlinePosts.filter((post) =>
        [post.title, post.excerpt, post.category, ...post.tags]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
    : onlinePosts;

  return (
    <>
      <SeoMeta title="FEED" description="Latest blog posts and articles on network infrastructure, proxy protocols, and self-hosted solutions." path="/feed" />
      <div className="section-header">
        <div>
          <p className="eyebrow">ENCRYPTED // PUBLIC KEY DETECTED</p>
          <h2>LATEST TRANSMISSIONS</h2>
        </div>
        <span className="online-pill">{visiblePosts.length} ONLINE</span>
      </div>
      <section className="brand-panel" aria-labelledby="feed-brand">
        <p className="eyebrow">INITIALIZING DATA LINK...</p>
        <h1 id="feed-brand">STANLEY CHAN</h1>
        <p>Live archive synchronized from local Markdown files in the posts directory.</p>
        <div className="brand-grid" aria-label="Project status">
          <span>{visiblePosts.length} POSTS ONLINE</span>
          <span>NETRUNNER ACTIVE</span>
          <span>MARKDOWN SOURCE</span>
        </div>
      </section>
      {query && (
        <p className="search-info">
          Searching for: <strong>"{query}"</strong> —
          <span> {visiblePosts.length} result{visiblePosts.length !== 1 ? 's' : ''} found</span>
        </p>
      )}
      <PostList posts={visiblePosts} />
    </>
  );
}
