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
          <p className="eyebrow">Encrypted public feed</p>
          <h2>FEED</h2>
        </div>
        <span className="online-pill">Online</span>
      </div>
      <section id="archive" className="brand-panel" aria-labelledby="brand-title">
        <p className="eyebrow">LATEST TRANSMISSIONS</p>
        <h1 id="brand-title">LATEST TRANSMISSIONS</h1>
        <p>Live archive synchronized from local Markdown files in the posts directory.</p>
        <div className="brand-grid" aria-label="Project status">
          <span>{visiblePosts.length} POSTS ONLINE</span>
          <span>AUTHOR SLOT READY</span>
          <span>MARKDOWN SOURCE</span>
        </div>
      </section>
      <PostList posts={visiblePosts} />
    </>
  );
}
