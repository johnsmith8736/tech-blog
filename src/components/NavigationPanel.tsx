import { Rss } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Feed', href: '/', icon: Rss },
];

export function NavigationPanel() {
  return (
    <section className="panel" aria-labelledby="navigation-title">
      <h2 id="navigation-title">Navigation</h2>
      <div className="side-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return item.href === '/' ? (
            <NavLink key={item.label} to={item.href}>
              <Icon size={17} aria-hidden="true" />
              {item.label}
            </NavLink>
          ) : (
            <a key={item.label} href={item.href}>
              <Icon size={17} aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
