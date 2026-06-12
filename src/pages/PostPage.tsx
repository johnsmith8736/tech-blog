import { ArrowLeft, FileX } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta';
import { MarkdownContent } from '../components/MarkdownContent';
import { TableOfContents } from '../components/TableOfContents';
import { ReadingProgress } from '../components/ReadingProgress';
import { onlinePosts } from '../data/posts';

export function PostPage() {
  const { slug } = useParams();
  const post = onlinePosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="post-page">
        <Link className="back-link" to="/feed">
          <ArrowLeft size={17} aria-hidden="true" />
          BACK TO FEED
        </Link>
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <FileX size={48} aria-hidden="true" style={{ marginBottom: '12px' }} />
          <p>POST NOT FOUND</p>
          <p style={{ fontSize: '0.78rem', marginTop: '8px', color: '#7a7a7a' }}>
            The post "{slug}" does not exist or has been archived.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SeoMeta title={post.title} description={post.excerpt} path={`/posts/${post.slug}`} />
      <ReadingProgress />
      <article className="post-page">
        <Link className="back-link" to="/feed">
          <ArrowLeft size={17} aria-hidden="true" />
          BACK TO FEED
        </Link>
        <div className="post-meta">
          <span>{post.category}</span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <h2>{post.title}</h2>
        <p className="lead">{post.excerpt}</p>
        <div className="post-layout">
          <div className="post-content">
            <MarkdownContent blocks={post.body} />
          </div>
          <TableOfContents blocks={post.body} />
        </div>
      </article>
    </>
  );
}
