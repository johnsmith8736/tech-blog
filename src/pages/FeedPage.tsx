import { useSearchParams } from 'react-router-dom';
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
      <div id="signals" className="section-header">
        <div>
          <p className="eyebrow">ENCRYPTED // PUBLIC KEY DETECTED</p>
          <h2>LATEST TRANSMISSIONS</h2>
        </div>
        <span className="online-pill">ONLINE</span>
      </div>
      <section id="archive" className="brand-panel" aria-labelledby="brand-title">
        <p className="eyebrow">INITIALIZING DATA LINK...</p>
        <h1 id="brand-title">STANLEY CHAN</h1>
        <p>Live archive synchronized from local Markdown files in the posts directory.</p>
        <div className="brand-grid" aria-label="Project status">
          <span>{visiblePosts.length} POSTS ONLINE</span>
          <span>NETRUNNER ACTIVE</span>
          <span>MARKDOWN SOURCE</span>
        </div>
      </section>
      <PostList posts={visiblePosts} />
    </>
  );
}
