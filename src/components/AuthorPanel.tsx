import { useEffect, useState, useContext, createContext } from 'react';
import { Github } from 'lucide-react';
import { author } from '../data/author';
import { useSystemStatus, type SystemStatusData } from '../hooks/useSystemStatus';

const SystemStatusContext = createContext<SystemStatusData | null>(null);

export function SystemStatusProvider({ children }: { children: React.ReactNode }) {
  const status = useSystemStatus();
  return (
    <SystemStatusContext.Provider value={status}>
      {children}
    </SystemStatusContext.Provider>
  );
}

export function useSharedSystemStatus(): SystemStatusData {
  const ctx = useContext(SystemStatusContext);
  if (!ctx) throw new Error('useSharedSystemStatus must be used within SystemStatusProvider');
  return ctx;
}

const GLITCH_QUOTES = [
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastr3ams of Night City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastr34ms of Night City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastreams of Night_City..."',
  '"Navigating the datastreams of Night City..."',
  '"Navigating the datastreams of Night City..."',
];

export function AuthorPanel() {
  const { ram, ice, uplink } = useSharedSystemStatus();
  const [glitchIdx, setGlitchIdx] = useState(0);
  const [roleGlitch, setRoleGlitch] = useState(false);

  // Glitch effect on bio text — randomly glitches ~5% of the time
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.06) {
        setGlitchIdx(Math.floor(Math.random() * GLITCH_QUOTES.length));
      } else {
        setGlitchIdx(0);
      }
    }, 600);
    return () => clearInterval(timer);
  }, []);

  // Role glitch — rare visual glitch on NETRUNNER
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleGlitch(Math.random() < 0.04);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const metrics = [
    { label: 'RAM', value: `${ram.value}%`, color: ram.color },
    { label: 'ICE', value: `${ice.value}%`, color: ice.color },
    { label: 'UPLINK', value: `${uplink.value}MS`, color: uplink.color },
  ];

  return (
    <section className="panel author-panel" aria-labelledby="author-name">
      <img className="avatar" src={author.avatarUrl} alt="" />
      <div>
        <h1 id="author-name">{author.name}</h1>
        <a className="handle" href={author.url} target="_blank" rel="noopener noreferrer">
          <Github size={16} aria-hidden="true" />
          {author.handle}
        </a>
      </div>
      <p
        className="role"
        style={{
          opacity: roleGlitch ? 0.6 : 1,
          textShadow: roleGlitch
            ? '3px 0 6px rgba(255,0,60,0.7), -1px 0 4px rgba(0,240,255,0.6)'
            : undefined,
          transform: roleGlitch ? 'skewX(-2deg) translateX(1px)' : undefined,
          transition: 'opacity 0.08s ease, text-shadow 0.08s ease, transform 0.08s ease',
        }}
      >
        {roleGlitch ? 'N3TRUNN3R' : author.role}
      </p>
      <p className="bio">{GLITCH_QUOTES[glitchIdx]}</p>
      <dl className="metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt>{metric.label}</dt>
            <dd
              style={{
                color: metric.color,
                textShadow: `0 0 8px ${
                  metric.color === '#ff003c'
                    ? 'rgba(255,0,60,0.6)'
                    : metric.color === '#fbbf24'
                      ? 'rgba(251,191,36,0.5)'
                      : 'rgba(0,240,255,0.5)'
                }`,
                transition: 'color 0.3s ease, text-shadow 0.3s ease',
              }}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}