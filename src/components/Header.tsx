import { Search } from 'lucide-react';
import { useId } from 'react';
import { NavLink } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export function Header() {
  const searchId = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const updateQuery = (value: string) => {
    setSearchParams((params) => {
      const nextParams = new URLSearchParams(params);

      if (value.trim()) {
        nextParams.set('q', value);
      } else {
        nextParams.delete('q');
      }

      return nextParams;
    });
  };

  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="Tech Blog home">
        <img className="brand-mark" src="/kali.svg" alt="" />
        <span className="brand-name glitch-text" data-text="STANLEY.CHAN">STANLEY.CHAN</span>
      </NavLink>
      <div className="header-actions">
        <label className="site-search" htmlFor={searchId}>
          <Search size={15} aria-hidden="true" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="SEARCH"
          />
        </label>
        <nav className="top-nav" aria-label="Primary navigation">
          <NavLink to="/" className="glitch-text" data-text="FEED">FEED</NavLink>
        </nav>
      </div>
    </header>
  );
}
