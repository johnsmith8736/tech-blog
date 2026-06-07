import { Rss } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Feed', href: '/', icon: Rss },
];

export function NavigationPanel() {
  return (
    <section className="panel" aria-labelledby="navigation-title">
      <h2 id="navigation-title">NAVIGATION</h2>
      <div className="side-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return item.href === '/' ? (
            <NavLink key={item.label} to={item.href}>
              <Icon size={17} aria-hidden="true" />
              <span className="glitch-text" data-text={item.label}>{item.label}</span>
            </NavLink>
          ) : (
            <a key={item.label} href={item.href}>
              <Icon size={17} aria-hidden="true" />
              <span className="glitch-text" data-text={item.label}>{item.label}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
