import { ArrowLeft, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta';

export function NotFoundPage() {
  return (
    <div className="post-page">
      <SeoMeta title="404 // SIGNAL LOST" description="Page not found — the requested transmission could not be located." />
      <div className="empty-state empty-state--404">
        <p className="notfound-kicker">SIGNAL LOST // PAGE NOT FOUND</p>
        <h1 className="notfound-title">ERROR 404</h1>
        <FileX size={64} aria-hidden="true" className="filex-icon" />
        <p className="notfound-desc">
          The requested transmission could not be located. It may have been intercepted, corrupted, or never existed.
        </p>
        <Link className="back-link" to="/">
          <ArrowLeft size={17} aria-hidden="true" />
          RETURN TO KNOWN SPACE
        </Link>
      </div>
    </div>
  );
}