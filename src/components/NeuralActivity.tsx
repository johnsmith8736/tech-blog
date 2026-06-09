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
  let color = 'rgba(0, 240, 255, 0.85)';
  let glow = 'rgba(0, 240, 255, 0.3)';
  let spinClass = 'spin-slow';
  let pulseClass = 'pulse-slow';

  if (status === 'SYSTOLE') {
    color = '#ffffff';
    glow = 'rgba(0, 240, 255, 0.7)';
    spinClass = 'spin-fast';
    pulseClass = 'pulse-fast';
  } else if (status === 'EXT-SYS') {
    color = '#ff003c';
    glow = 'rgba(255, 0, 60, 0.8)';
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
  // Single audio waveform — bell-envelope, multi-harmonic, center-peaked
  const [waveData, setWaveData] = useState<number[]>(() =>
    Array.from({ length: 100 }, (_, i) => {
      const x = i / 99;
      const env = Math.sin(Math.PI * x) ** 1.3;
      return 0.5 + env * 0.35 * Math.sin(2 * Math.PI * 18 * x);
    })
  );

  const [freq, setFreq] = useState(440);
  const [amplitude, setAmplitude] = useState(72);
  const [harmonics, setHarmonics] = useState(3);
  const [waveStatus, setWaveStatus] = useState<'SINE' | 'CHORD' | 'FM' | 'RING'>('SINE');

  const waveDataRef = useRef<number[]>([]);
  waveDataRef.current = waveData;

  const phaseRef = useRef(0);
  const envPhaseRef = useRef(0);

  // Audio waveform generator — bell envelope (low→high→low), multi-harmonic
  useEffect(() => {
    const N = 100;
    const timer = setInterval(() => {
      phaseRef.current += 0.038;
      envPhaseRef.current += 0.008;

      const p = phaseRef.current;
      const ep = envPhaseRef.current;

      // Dynamic envelope breathing
      const breath = 0.75 + 0.25 * Math.sin(ep);

      const data = new Array(N);
      for (let i = 0; i < N; i++) {
        const x = i / (N - 1);

        // Bell-shaped envelope: 0 at edges, 1 at center
        const envelope = Math.sin(Math.PI * x) ** 1.4 * breath;

        // Multi-harmonic scrolling wave
        const scroll = x * 22 + p;
        const wave = envelope * (
          0.40 * Math.sin(2 * Math.PI * scroll) +
          0.26 * Math.sin(2 * Math.PI * (scroll * 2.3 + 0.3)) +
          0.18 * Math.sin(2 * Math.PI * (scroll * 4.1 + 0.9)) +
          0.12 * Math.sin(2 * Math.PI * (scroll * 7.5 + 1.6)) +
          0.08 * Math.sin(2 * Math.PI * (scroll * 11 + 2.7)) +
          0.05 * Math.sin(2 * Math.PI * (scroll * 16 + 4.2))
        );

        // Micro noise for texture
        const noise = envelope * 0.04 * (Math.random() - 0.5);

        data[i] = Math.max(0.02, Math.min(0.98, 0.5 + wave + noise));
      }

      setWaveData(data);

      // Telemetry
      setFreq((prev) => {
        const goal = 380 + Math.round(160 * Math.sin(ep * 0.6));
        return Math.round(prev + (goal - prev) * 0.08);
      });

      setAmplitude((prev) => {
        const goal = 45 + 45 * breath;
        return Number((prev + (goal - prev) * 0.12).toFixed(1));
      });

      setHarmonics((prev) => {
        if (Math.sin(p * 0.7 + ep) > 0.94) return Math.min(5, prev + 1);
        if (Math.sin(p * 0.7 + ep) < -0.94) return Math.max(1, prev - 1);
        return prev;
      });

      const centerVal = data[Math.floor(N / 2)];
      const centerAmp = Math.abs(centerVal - 0.5) * 2;
      if (centerAmp > 0.82) setWaveStatus('FM');
      else if (harmonics > 3) setWaveStatus('CHORD');
      else if (centerAmp > 0.55) setWaveStatus('RING');
      else setWaveStatus('SINE');
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // Renders a jagged sawtooth-like waveform as straight line segments
  const generateWavePath = (
    data: number[],
    w = 280,
    h = 60,
    amp = 0.92,
    baseline = 0.5
  ) => {
    if (data.length === 0) return '';
    const step = w / (data.length - 1);
    const pts = data.map((v, i) => ({
      x: i * step,
      y: h * (1 - (baseline + (v - 0.5) * amp))
    }));
    // Use straight line segments for sharp jagged edges
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x} ${pts[i].y}`;
    }
    return d;
  };

  const mainPath = generateWavePath(waveData, 280, 60, 0.92, 0.5);

  let statusColorClass = 'status-green';
  let activeBarColor = 'rgba(0, 240, 255, 0.85)';
  if (waveStatus === 'CHORD') {
    statusColorClass = 'status-yellow';
    activeBarColor = '#fbbf24';
  } else if (waveStatus === 'FM') {
    statusColorClass = 'status-red';
    activeBarColor = '#ff003c';
  } else if (waveStatus === 'RING') {
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
            <linearGradient id="wave-fade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 240, 255, 0.15)" />
              <stop offset="10%" stopColor="rgba(0, 240, 255, 0.6)" />
              <stop offset="30%" stopColor="rgba(0, 240, 255, 0.95)" />
              <stop offset="70%" stopColor="rgba(0, 240, 255, 0.95)" />
              <stop offset="90%" stopColor="rgba(0, 240, 255, 0.6)" />
              <stop offset="100%" stopColor="rgba(0, 240, 255, 0.15)" />
            </linearGradient>
          </defs>

          {/* Single audio waveform — bell envelope, multi-harmonic */}
          <path
            d={mainPath}
            fill="none"
            stroke="url(#wave-fade-grad)"
            strokeWidth="2.0"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Telemetry Info Area — Sound Wave Metrics */}
      <div className="telemetry-info graphical-panel" aria-label="Sound wave diagnostic panel">
        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">FREQ</span>
            <span className={`telemetry-val ${freq > 700 ? 'status-red' : freq < 300 ? 'status-blue' : ''}`}>{freq} Hz</span>
          </div>
          <MeterBar val={freq} min={220} max={880} activeColor={activeBarColor} />
        </div>

        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">AMPL</span>
            <span className="telemetry-val">{amplitude}%</span>
          </div>
          <MeterBar val={amplitude} min={20} max={95} activeColor={activeBarColor} />
        </div>

        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">HARM</span>
            <span className="telemetry-val">{harmonics}</span>
          </div>
          <MeterBar val={harmonics} min={1} max={6} activeColor={activeBarColor} />
        </div>

        <div className="telemetry-col align-right flex-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div className="telemetry-header">
            <span className="telemetry-label">MODE</span>
            <span className={`telemetry-val ${statusColorClass}`}>{waveStatus}</span>
          </div>
          <div className="status-graphic-ring" style={{ marginTop: '2px', display: 'flex', justifyContent: 'flex-end' }}>
            <StatusRing status={waveStatus === 'FM' ? 'EXT-SYS' : waveStatus === 'CHORD' ? 'SYSTOLE' : waveStatus === 'RING' ? 'COMPENSATE' : 'NOMINAL'} />
          </div>
        </div>
      </div>
    </section>
  );
}
