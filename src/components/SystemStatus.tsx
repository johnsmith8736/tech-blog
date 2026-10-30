import { useSharedSystemStatus } from './AuthorPanel';
import { AnimatedCounter } from './AnimatedCounter';

export function SystemStatus() {
  const { firewall, traceRoute, dataFragments, indexNodes } = useSharedSystemStatus();

  const items = [
    {
      label: 'FIREWALL',
      value: firewall.active ? 'ACTIVE' : 'BREACH',
      tone: firewall.active ? 'status--ok' : 'status--err',
    },
    {
      label: 'TRACE_ROUTE',
      value: traceRoute.blocked ? 'BLOCKED' : 'OPEN',
      tone: traceRoute.blocked ? 'status--err' : 'status--ok',
    },
    {
      label: 'DATA_FRAGMENTS',
      value: dataFragments.value,
      tone: 'status--muted',
      animated: true,
    },
    {
      label: 'INDEX_NODES',
      value: indexNodes.value,
      tone: 'status--ok',
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
              <AnimatedCounter value={item.value as number} className={item.tone} />
            ) : (
              <strong className={item.tone}>{item.value}</strong>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
