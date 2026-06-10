import { useEffect, useState, useRef } from 'react';

export interface SystemMetric {
  value: number;
  status: 'nominal' | 'warn' | 'crit';
  color: string;
}

function ringStatus(val: number, warn = 85, crit = 95) {
  if (val >= crit) return 'crit';
  if (val >= warn) return 'warn';
  return 'nominal';
}

function colorFor(val: 'nominal' | 'warn' | 'crit') {
  if (val === 'crit') return '#ff003c';
  if (val === 'warn') return '#fbbf24';
  return '#00f0ff';
}

export interface SystemStatusData {
  ram: SystemMetric;
  ice: SystemMetric;
  uplink: SystemMetric;
  firewall: { active: boolean };
}

export function useSystemStatus(): SystemStatusData {
  const [ram, setRam] = useState(64);
  const [ice, setIce] = useState(88);
  const [uplink, setUplink] = useState(42);
  const [firewall, setFirewall] = useState(true);

  // Use refs to track mounted state for cleanup
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const timer = setInterval(() => {
      if (!mounted.current) return;

      // RAM: gentle wander around 55-78% (nominal range)
      setRam((prev) => {
        const target = 55 + 23 * (0.5 + 0.5 * Math.sin(Date.now() * 0.0008 + 1.2));
        const next = prev + (target - prev) * 0.06 + (Math.random() - 0.5) * 2.5;
        return Math.round(Math.max(35, Math.min(98, next)));
      });

      // ICE (temp): slowly drifts, occasional spikes
      setIce((prev) => {
        const base = 78 + 15 * (0.5 + 0.5 * Math.sin(Date.now() * 0.0005 + 2.7));
        const spike = Math.random() > 0.92 ? (Math.random() - 0.5) * 12 : 0;
        const next = prev + (base - prev) * 0.08 + spike;
        return Math.round(Math.max(60, Math.min(99, next)));
      });

      // UPLINK: wander 20-85ms with noise
      setUplink((prev) => {
        const target = 30 + 40 * (0.5 + 0.5 * Math.sin(Date.now() * 0.0011 + 0.4));
        const next = prev + (target - prev) * 0.07 + (Math.random() - 0.5) * 3;
        return Math.round(Math.max(9, Math.min(120, next)));
      });

      // Firewall: mostly on, rare toggle
      setFirewall(Math.random() > 0.003);
    }, 800);

    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, []);

  return {
    ram: { value: ram, status: ringStatus(ram, 80, 92), color: colorFor(ringStatus(ram, 80, 92)) },
    ice: { value: ice, status: ringStatus(ice, 85, 95), color: colorFor(ringStatus(ice, 85, 95)) },
    uplink: { value: uplink, status: ringStatus(uplink, 65, 90), color: colorFor(ringStatus(uplink, 65, 90)) },
    firewall: { active: firewall },
  };
}