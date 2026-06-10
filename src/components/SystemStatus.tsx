import { Cpu, Thermometer, Wifi, ShieldCheck } from 'lucide-react';
import { useSharedSystemStatus } from './AuthorPanel';

export function SystemStatus() {
  const { ram, ice, uplink, firewall } = useSharedSystemStatus();

  const items = [
    {
      label: 'RAM',
      value: `${ram.value}%`,
      icon: Cpu,
      color: ram.color,
    },
    {
      label: 'ICE',
      value: `${ice.value}%`,
      icon: Thermometer,
      color: ice.color,
    },
    {
      label: 'UPLINK',
      value: `${uplink.value}MS`,
      icon: Wifi,
      color: uplink.color,
    },
    {
      label: 'FIREWALL',
      value: firewall.active ? 'ACTIVE' : 'BREACH',
      icon: ShieldCheck,
      color: firewall.active ? '#00f0ff' : '#ff003c',
    },
  ];

  return (
    <section className="panel" aria-labelledby="status-title">
      <h2 id="status-title">SYSTEM STATUS</h2>
      <ul className="status-list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <Icon size={14} aria-hidden="true" style={{ color: item.color, flexShrink: 0 }} />
              <span>{item.label}</span>
              <strong
                style={{
                  color: item.color,
                  textShadow: `0 0 8px ${item.color === '#ff003c' ? 'rgba(255,0,60,0.6)' : item.color === '#fbbf24' ? 'rgba(251,191,36,0.5)' : 'rgba(0,240,255,0.5)'}`,
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                }}
              >
                {item.value}
              </strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}