import { Outlet } from 'react-router-dom';
import { AuthorPanel, SystemStatusProvider } from './components/AuthorPanel';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NavigationPanel } from './components/NavigationPanel';
import { NeuralActivity } from './components/NeuralActivity';
import { SystemStatus } from './components/SystemStatus';

export default function App() {
  return (
    <div className="app-container">
      <div className="ambient-orbs" aria-hidden="true">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
      </div>
      <SystemStatusProvider>
      <div className="app-shell">
        <Header />
        <main className="layout">
          <aside className="sidebar" aria-label="Profile and navigation">
            <AuthorPanel />
            <NavigationPanel />
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
