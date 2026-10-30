import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthorPanel, SystemStatusProvider } from './components/AuthorPanel';
import { Footer } from './components/Footer';
import { Header, type ThemeMode } from './components/Header';
import { NavigationPanel } from './components/NavigationPanel';
import { NeuralActivity } from './components/NeuralActivity';
import { SystemStatus } from './components/SystemStatus';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function readStoredTheme(): ThemeMode {
  const stored = localStorage.getItem('theme-mode');
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

function resolveEffective(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = resolveEffective(themeMode);
    localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (themeMode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      document.documentElement.dataset.theme = media.matches ? 'dark' : 'light';
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [themeMode]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-container">
      <div className="ambient-orbs" aria-hidden="true">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
      </div>
      <SystemStatusProvider>
      <ScrollToTop />
      <div className="app-shell">
        <Header onMenuToggle={toggleSidebar} theme={themeMode} onThemeToggle={setThemeMode} />
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
        )}
        <main className="layout">
          <aside
            className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}
            aria-label="Profile and navigation"
          >
            <AuthorPanel />
            <NavigationPanel onNavigate={closeSidebar} />
            <NeuralActivity />
            <SystemStatus />
          </aside>
          <section className="content-frame">
            <Outlet />
          </section>
        </main>
        <Footer />
      </div>
      </SystemStatusProvider>
    </div>
  );
}
