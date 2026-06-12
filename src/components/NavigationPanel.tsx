import { Rss, LayoutDashboard, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Home', href: '/', icon: LayoutDashboard },
  { label: 'Feed', href: '/feed', icon: Rss },
  { label: 'About', href: '/about', icon: User },
];

type NavigationPanelProps = {
  onNavigate?: () => void;
};

export function NavigationPanel({ onNavigate }: NavigationPanelProps) {
  return (
    <section className="panel" aria-labelledby="navigation-title">
      <h2 id="navigation-title">NAVIGATION</h2>
      <div className="side-nav" onClick={onNavigate}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.href} end={item.href === '/'}>
              <Icon size={17} aria-hidden="true" />
              <span className="glitch-text" data-text={item.label}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </section>
  );
}
