import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthorPanel, SystemStatusProvider } from './components/AuthorPanel';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NavigationPanel } from './components/NavigationPanel';
import { NeuralActivity } from './components/NeuralActivity';
import { SystemStatus } from './components/SystemStatus';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <Header onMenuToggle={toggleSidebar} />
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
