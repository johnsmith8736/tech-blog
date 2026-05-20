import { useEffect, useState, useRef } from 'react';

// 微缩段状发光进度条组件 (水平格栅电平表)
function MeterBar({ val, min, max, activeColor }: { val: number; min: number; max: number; activeColor: string }) {
  const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));
  const litCount = Math.max(1, Math.round(pct * 8));
  return (
    <div className="meter-bar" style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const isLit = i < litCount;
        return (
          <div
            key={i}
            className="meter-segment"
            style={{
              width: '6px',
              height: '3px',
              borderRadius: '0.5px',
              backgroundColor: isLit ? activeColor : 'rgba(255, 255, 255, 0.05)',
              boxShadow: isLit ? `0 0 5px ${activeColor}` : 'none',
              transition: 'background-color 0.15s ease, box-shadow 0.15s ease'
            }}
          />
        );
      })}
    </div>
  );
}

// 动态诊断 SVG 状态指示环 (LED Ring)
function StatusRing({ status }: { status: 'NOMINAL' | 'SYSTOLE' | 'EXT-SYS' | 'COMPENSATE' }) {
  let color = 'rgba(197, 168, 128, 0.85)';
  let glow = 'rgba(197, 168, 128, 0.3)';
  let spinClass = 'spin-slow';
  let pulseClass = 'pulse-slow';

  if (status === 'SYSTOLE') {
    color = '#ffffff';
    glow = 'rgba(197, 168, 128, 0.7)';
    spinClass = 'spin-fast';
    pulseClass = 'pulse-fast';
  } else if (status === 'EXT-SYS') {
    color = '#ef4444';
    glow = 'rgba(239, 68, 68, 0.8)';
    spinClass = 'spin-v-fast';
    pulseClass = 'pulse-v-fast';
  } else if (status === 'COMPENSATE') {
    color = '#00f0ff';
    glow = 'rgba(0, 240, 255, 0.7)';
    spinClass = 'spin-none';
    pulseClass = 'pulse-deep';
  }

  return (
    <svg width="20" height="20" viewBox="0 0 22 22" className="status-ring-svg" style={{ display: 'block' }}>
      <defs>
        <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* 外部雷达刻度环 */}
      <circle
        cx="11"
        cy="11"
        r="9"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="4, 2.5"
        className={`ring-outer ${spinClass}`}
        style={{ filter: 'url(#ring-glow)', transformOrigin: 'center' }}
      />
      {/* 中心生理心搏实体点 */}
      <circle
        cx="11"
        cy="11"
        r="3"
        fill={color}
        className={`ring-inner ${pulseClass}`}
        style={{ transformOrigin: 'center', filter: `drop-shadow(0 0 3px ${glow})` }}
      />
    </svg>
  );
}

export function NeuralActivity() {
  const [points, setPoints] = useState<number[]>(() =>
    Array.from({ length: 40 }, () => 0.16 + Math.random() * 0.03)
  );

  const [frequency, setFrequency] = useState(720.54);
  const [stability, setStability] = useState(99.87);
  const [load, setLoad] = useState(12.4);
  const [ecgStatus, setEcgStatus] = useState<'NOMINAL' | 'SYSTOLE' | 'EXT-SYS' | 'COMPENSATE'>('NOMINAL');

  const pointsRef = useRef<number[]>([]);
  pointsRef.current = points;

  const ticksSinceLastBeatRef = useRef(0);
  const targetPeriodRef = useRef(13);

  const isExtraSystoleRef = useRef(false);
  const isCompensatoryRef = useRef(false);
  const noiseStateRef = useRef(0.16);

  useEffect(() => {
    const timer = setInterval(() => {
      ticksSinceLastBeatRef.current += 1;
      let ticksSince = ticksSinceLastBeatRef.current;
      let currTarget = targetPeriodRef.current;

      if (ticksSince >= currTarget) {
        ticksSinceBeat();
        ticksSince = 0;
        currTarget = targetPeriodRef.current;
      }

      const rem = currTarget - ticksSince;
      let ecgDelta = 0;

      if (ticksSince === 0) {
        ecgDelta = 0.72;
      } else if (ticksSince === 1) {
        ecgDelta = -0.24;
      } else if (ticksSince === 2) {
        ecgDelta = -0.06;
      } else if (ticksSince === 3) {
        ecgDelta = 0.0;
      } else if (ticksSince === 4) {
        ecgDelta = 0.08;
      } else if (ticksSince === 5) {
        ecgDelta = 0.22;
      } else if (ticksSince === 6) {
        ecgDelta = 0.10;
      } else if (ticksSince === 7) {
        ecgDelta = 0.02;
      } else if (ticksSince >= 8 && ticksSince < currTarget - 3) {
        ecgDelta = 0.0;
      } else {
        const isNotExtra = !isExtraSystoleRef.current;
        if (rem === 3 && isNotExtra) {
          ecgDelta = 0.04;
        } else if (rem === 2 && isNotExtra) {
          ecgDelta = 0.12;
        } else if (rem === 1 && isNotExtra) {
          ecgDelta = -0.12;
        }
      }

      const rand = Math.random();
      let nextNoise = noiseStateRef.current * 0.75 + (rand - 0.5) * 0.05 + 0.042;
      nextNoise = Math.max(0.12, Math.min(0.18, nextNoise));
      noiseStateRef.current = nextNoise;

      const nextVal = Math.max(0.02, Math.min(0.96, nextNoise + ecgDelta));
      const nextPoints = [...pointsRef.current.slice(1), nextVal];
      setPoints(nextPoints);

      const isNormalPeak = ticksSince === 0 && !isExtraSystoleRef.current;
      const isExtraPeak = ticksSince === 0 && isExtraSystoleRef.current;

      setFrequency((prev) => {
        if (isExtraPeak) {
          const boost = 32.0 + Math.random() * 8.0;
          return Number((720.54 + boost).toFixed(2));
        } else if (isNormalPeak) {
          const boost = 18.0 + Math.random() * 6.0;
          return Number((720.54 + boost).toFixed(2));
        } else {
          return Number((prev + (720.54 - prev) * 0.15).toFixed(2));
        }
      });

      setStability((prev) => {
        if (isExtraPeak) {
          return Number((99.87 - (1.6 + Math.random() * 0.8)).toFixed(2));
        } else if (isNormalPeak) {
          return Number((99.87 - (0.6 + Math.random() * 0.4)).toFixed(2));
        } else {
          return Number(Math.max(99.75, Math.min(99.95, prev + (99.87 - prev) * 0.15)).toFixed(2));
        }
      });

      setLoad((prev) => {
        if (isExtraPeak) {
          return Number((52.0 + Math.random() * 8.0).toFixed(1));
        } else if (isNormalPeak) {
          return Number((32.0 + Math.random() * 6.0).toFixed(1));
        } else {
          return Number(Math.max(10.0, Math.min(14.5, prev + (12.4 - prev) * 0.15)).toFixed(1));
        }
      });

      if (isExtraPeak) {
        setEcgStatus('EXT-SYS');
      } else if (isNormalPeak) {
        setEcgStatus('SYSTOLE');
      } else if (ticksSince === 4 && ecgStatus === 'SYSTOLE') {
        setEcgStatus('NOMINAL');
      } else if (currTarget === 22 && ticksSince >= 8 && ticksSince < 16) {
        setEcgStatus('COMPENSATE');
      } else if (ticksSince >= 16 && ecgStatus === 'COMPENSATE') {
        setEcgStatus('NOMINAL');
      }
    }, 80);

    function ticksSinceBeat() {
      ticksSinceLastBeatRef.current = 0;
      if (isCompensatoryRef.current) {
        targetPeriodRef.current = 22;
        isCompensatoryRef.current = false;
        isExtraSystoleRef.current = false;
      } else {
        if (Math.random() < 0.045) {
          isExtraSystoleRef.current = true;
          targetPeriodRef.current = 6;
          isCompensatoryRef.current = true;
        } else {
          isExtraSystoleRef.current = false;
          targetPeriodRef.current = 11 + Math.floor(Math.random() * 6);
        }
      }
    }

    return () => clearInterval(timer);
  }, [ecgStatus]);

  const generateSmoothPath = (data: number[]) => {
    if (data.length === 0) return '';
    const pointsCount = data.length;
    const w = 280;
    const h = 60;
    const step = w / (pointsCount - 1);

    const coords = data.map((val, idx) => {
      const x = idx * step;
      const y = h - 4 - val * (h - 8);
      return { x, y };
    });

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const xc = (p0.x + p1.x) / 2;
      const yc = (p0.y + p1.y) / 2;
      d += ` Q ${p0.x} ${p0.y}, ${xc} ${yc}`;
    }
    d += ` L ${coords[coords.length - 1].x} ${coords[coords.length - 1].y}`;
    return d;
  };

  const secondaryPoints = points.slice(10).concat(points.slice(0, 10)).map(val => val * 0.26);

  const mainPath = generateSmoothPath(points);
  const secondaryPath = generateSmoothPath(secondaryPoints);

  let statusColorClass = 'status-green';
  let activeBarColor = 'rgba(197, 168, 128, 0.85)';
  if (ecgStatus === 'SYSTOLE') {
    statusColorClass = 'status-yellow';
  } else if (ecgStatus === 'EXT-SYS') {
    statusColorClass = 'status-red';
    activeBarColor = '#ef4444';
  } else if (ecgStatus === 'COMPENSATE') {
    statusColorClass = 'status-blue';
    activeBarColor = '#00f0ff';
  }

  return (
    <section className="panel neural-activity" aria-labelledby="neural-activity-title">
      <h2 id="neural-activity-title">QUANTUM FREQUENCY</h2>
      <div className="neural-graph" aria-hidden="true">
        {/* Precision Grid Backdrop */}
        <div className="telemetry-grid">
          <div className="grid-h-line h-1"></div>
          <div className="grid-h-line h-2"></div>
          <div className="grid-h-line h-3"></div>
          <div className="grid-v-line v-1"></div>
          <div className="grid-v-line v-2"></div>
          <div className="grid-v-line v-3"></div>
        </div>

        <svg className="quantum-waves atlassc-waves" viewBox="0 0 280 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="ecg-fade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(197, 168, 128, 0)" />
              <stop offset="8%" stopColor="rgba(197, 168, 128, 0.45)" />
              <stop offset="15%" stopColor="rgba(197, 168, 128, 0.9)" />
              <stop offset="85%" stopColor="rgba(197, 168, 128, 0.9)" />
              <stop offset="92%" stopColor="rgba(197, 168, 128, 0.45)" />
              <stop offset="100%" stopColor="rgba(197, 168, 128, 0)" />
            </linearGradient>

            <linearGradient id="cyan-fade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0)" />
              <stop offset="12%" stopColor="rgba(0, 240, 255, 0.16)" />
              <stop offset="88%" stopColor="rgba(0, 240, 255, 0.16)" />
              <stop offset="100%" stopColor="rgba(0, 240, 255, 0)" />
            </linearGradient>
          </defs>

          {/* Layer 1: Background Interfering Cyan Line */}
          <path
            className="neural-wave wave-secondary"
            d={secondaryPath}
            fill="none"
            stroke="url(#cyan-fade-grad)"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />

          {/* Layer 2: Main Continuous ECG Golden Line */}
          <path
            className="neural-wave wave-main"
            d={mainPath}
            fill="none"
            stroke="url(#ecg-fade-grad)"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Telemetry Info Area with Graphical MeterBars and Status LED Ring */}
      <div className="telemetry-info graphical-panel" aria-label="System diagnostic panel">
        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">CORE FREQ</span>
            <span className="telemetry-val">{frequency} GHz</span>
          </div>
          <MeterBar val={frequency} min={720.54} max={755.54} activeColor={activeBarColor} />
        </div>
        
        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">STABILITY</span>
            <span className={`telemetry-val ${ecgStatus === 'EXT-SYS' ? 'status-red' : ''}`}>{stability}%</span>
          </div>
          <MeterBar val={stability} min={97.5} max={99.95} activeColor={activeBarColor} />
        </div>

        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">SYSTEM LOAD</span>
            <span className="telemetry-val">{load}%</span>
          </div>
          <MeterBar val={load} min={10.0} max={60.0} activeColor={activeBarColor} />
        </div>

        <div className="telemetry-col align-right flex-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div className="telemetry-header">
            <span className="telemetry-label">STATUS</span>
            <span className={`telemetry-val ${statusColorClass}`}>{ecgStatus}</span>
          </div>
          <div className="status-graphic-ring" style={{ marginTop: '2px', display: 'flex', justifyContent: 'flex-end' }}>
            <StatusRing status={ecgStatus} />
          </div>
        </div>
      </div>
    </section>
  );
}
