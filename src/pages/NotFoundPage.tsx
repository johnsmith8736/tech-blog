import { ArrowLeft, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta';

export function NotFoundPage() {
  return (
    <div className="post-page">
      <SeoMeta title="404 // SIGNAL LOST" description="Page not found — the requested transmission could not be located." />
      <div className="empty-state" style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', letterSpacing: '0.3em', color: '#7a7a7a', marginBottom: '16px' }}>
          SIGNAL LOST // PAGE NOT FOUND
        </p>
        <h1
          className="glitch-text"
          data-text="ERROR 404"
          style={{ fontSize: '4rem', margin: '0 0 24px' }}
        >
          ERROR 404
        </h1>
        <FileX size={64} aria-hidden="true" style={{ marginBottom: '16px', color: 'var(--cyber-red)' }} />
        <p style={{ maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6, color: '#b0b0b0' }}>
          The requested transmission could not be located. It may have been intercepted, corrupted, or never existed.
        </p>
        <Link className="back-link" to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={17} aria-hidden="true" />
          RETURN TO KNOWN SPACE
        </Link>
      </div>
    </div>
  );
}