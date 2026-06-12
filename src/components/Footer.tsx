import { Github, Rss, Mail, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer footer-enhanced">
      <div className="footer-grid">
        <div className="footer-col">
          <span className="footer-heading">NAVIGATION</span>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/feed" className="footer-link">Feed</Link>
          <Link to="/about" className="footer-link">About</Link>
        </div>
        <div className="footer-col">
          <span className="footer-heading">CONNECT</span>
          <a href="https://github.com/johnsmith8736" className="footer-link" target="_blank" rel="noopener noreferrer">
            <Github size={14} aria-hidden="true" /> GitHub
          </a>
          <a href="mailto:johnsmith874436@gmail.com" className="footer-link">
            <Mail size={14} aria-hidden="true" /> Email
          </a>
          <a href="/feed" className="footer-link">
            <Rss size={14} aria-hidden="true" /> RSS Feed
          </a>
        </div>
        <div className="footer-col footer-col--right">
          <span className="footer-heading">SIGNAL</span>
          <span className="footer-meta">© 2077 STANLEY CHAN</span>
          <span className="footer-meta">Netwatch Protocol v.2.55</span>
          <span className="footer-meta">NO RIGHTS RESERVED</span>
        </div>
      </div>
      <button
        type="button"
        className="back-to-top"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
