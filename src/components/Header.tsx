import { Search, Menu, Monitor, Sun, Moon } from 'lucide-react';
import { useId } from 'react';
import { NavLink } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export type ThemeMode = 'system' | 'light' | 'dark';

const THEME_LABELS: Record<ThemeMode, string> = {
  system: '跟随系统',
  light: '浅色',
  dark: '深色',
};

const NEXT_THEME: Record<ThemeMode, ThemeMode> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

type HeaderProps = {
  onMenuToggle: () => void;
  theme: ThemeMode;
  onThemeToggle: (next: ThemeMode) => void;
};

export function Header({ onMenuToggle, theme, onThemeToggle }: HeaderProps) {
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
        <span className="brand-name">STANLEY.CHAN</span>
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
          <NavLink to="/feed">FEED</NavLink>
          <NavLink to="/about">ABOUT</NavLink>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => onThemeToggle(NEXT_THEME[theme])}
          aria-label={`主题：${THEME_LABELS[theme]}，点击切换`}
          title={`主题：${THEME_LABELS[theme]}`}
        >
          {theme === 'system' ? <Monitor size={19} /> : theme === 'light' ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button
          type="button"
          className="hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
