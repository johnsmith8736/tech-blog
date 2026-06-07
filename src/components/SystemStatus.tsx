import { ShieldCheck, Wifi, Database, Radio } from 'lucide-react';

const statusItems = [
  { label: 'FIREWALL', value: 'ACTIVE', icon: ShieldCheck },
  { label: 'TRACE_ROUTE', value: 'BLOCKED', icon: Radio },
  { label: 'DATA_FRAGMENTS', value: '0', icon: Database },
  { label: 'INDEX_NODES', value: '4', icon: Wifi },
];

export function SystemStatus() {
  return (
    <section className="panel" aria-labelledby="status-title">
      <h2 id="status-title">SYSTEM STATUS</h2>
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
