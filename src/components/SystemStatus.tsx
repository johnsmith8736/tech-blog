import { Activity, ShieldCheck, Wifi } from 'lucide-react';

const statusItems = [
  { label: 'Firewall', value: 'Active', icon: ShieldCheck },
  { label: 'Index', value: '4 Nodes', icon: Activity },
  { label: 'Feed', value: 'Online', icon: Wifi },
];

export function SystemStatus() {
  return (
    <section className="panel" aria-labelledby="status-title">
      <h2 id="status-title">System Status</h2>
      <ul className="status-list">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Icon size={16} aria-hidden="true" />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
