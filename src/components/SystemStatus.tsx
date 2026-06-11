import { useSharedSystemStatus } from './AuthorPanel';
import { AnimatedCounter } from './AnimatedCounter';

export function SystemStatus() {
  const { firewall, traceRoute, dataFragments, indexNodes } = useSharedSystemStatus();

  const items = [
    {
      label: 'FIREWALL',
      value: firewall.active ? 'ACTIVE' : 'BREACH',
      color: firewall.active ? '#00f0ff' : '#ff003c',
    },
    {
      label: 'TRACE_ROUTE',
      value: traceRoute.blocked ? 'BLOCKED' : 'OPEN',
      color: traceRoute.blocked ? '#ff003c' : '#00f0ff',
    },
    {
      label: 'DATA_FRAGMENTS',
      value: dataFragments.value,
      color: '#a3a3a3',
      animated: true,
    },
    {
      label: 'INDEX_NODES',
      value: indexNodes.value,
      color: '#00f0ff',
      animated: true,
    },
  ];

  return (
    <section className="panel" aria-labelledby="status-title">
      <h2 id="status-title">SYSTEM STATUS</h2>
      <ul className="status-list">
        {items.map((item) => (
          <li key={item.label}>
            <span>{item.label}</span>
            {item.animated ? (
              <AnimatedCounter value={item.value as number} color={item.color} />
            ) : (
              <strong
                style={{
                  color: item.color,
                  textShadow: `0 0 8px ${
                    item.color === '#ff003c'
                      ? 'rgba(255,0,60,0.6)'
                      : 'rgba(0,240,255,0.5)'
                  }`,
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                }}
              >
                {item.value}
              </strong>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}