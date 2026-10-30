import { useEffect, useState, useRef } from 'react';

type Tone = 'ok' | 'warn' | 'err';

// M3E 色块电平表
function MeterBar({ val, min, max, tone }: { val: number; min: number; max: number; tone: Tone }) {
  const pct = Math.max(0, Math.min(1, (val - min) / (max - min)));
  const litCount = Math.max(1, Math.round(pct * 8));
  return (
    <div className="meter-bar">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`meter-segment${i < litCount ? ` is-lit seg-${tone}` : ''}`}
        />
      ))}
    </div>
  );
}

// M3E 状态环：纯色描边 + 形状呼吸
function StatusRing({ status }: { status: 'NOMINAL' | 'SYSTOLE' | 'EXT-SYS' | 'COMPENSATE' }) {
  let variant = 'status-ring--nominal';
  let spinClass = 'spin-slow';
  let pulseClass = 'pulse-slow';

  if (status === 'SYSTOLE') {
    variant = 'status-ring--sys';
    spinClass = 'spin-fast';
    pulseClass = 'pulse-fast';
  } else if (status === 'EXT-SYS') {
    variant = 'status-ring--err';
    spinClass = 'spin-v-fast';
    pulseClass = 'pulse-v-fast';
  } else if (status === 'COMPENSATE') {
    variant = 'status-ring--comp';
    spinClass = 'spin-none';
    pulseClass = 'pulse-deep';
  }

  return (
    <svg width="20" height="20" viewBox="0 0 22 22" className={`status-ring-svg ${variant}`}>
      <circle cx="11" cy="11" r="9" className={`ring-outer ${spinClass}`} />
      <circle cx="11" cy="11" r="3" className={`ring-inner ${pulseClass}`} />
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

  // Smooth flowing curve (M3E: no jagged neon edges)
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
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${pts[i].x} ${pts[i].y} ${mx} ${my}`;
    }
    d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
    return d;
  };

  const mainPath = generateWavePath(waveData, 280, 60, 0.92, 0.5);
  const areaPath = `${mainPath} L 280 30 L 0 30 Z`;

  let statusClass = 'status--ok';
  let tone: Tone = 'ok';
  let ringStatus: 'NOMINAL' | 'SYSTOLE' | 'EXT-SYS' | 'COMPENSATE' = 'NOMINAL';
  if (waveStatus === 'CHORD') {
    statusClass = 'status--warn';
    tone = 'warn';
    ringStatus = 'SYSTOLE';
  } else if (waveStatus === 'FM') {
    statusClass = 'status--err';
    tone = 'err';
    ringStatus = 'EXT-SYS';
  } else if (waveStatus === 'RING') {
    statusClass = 'status--ok';
    tone = 'ok';
    ringStatus = 'COMPENSATE';
  }

  return (
    <section className="panel neural-activity" aria-labelledby="neural-activity-title">
      <h2 id="neural-activity-title">QUANTUM FREQUENCY</h2>
      <div className="neural-graph" aria-hidden="true">
        <div className="telemetry-grid">
          <div className="grid-h-line h-1"></div>
          <div className="grid-h-line h-2"></div>
          <div className="grid-h-line h-3"></div>
          <div className="grid-v-line v-1"></div>
          <div className="grid-v-line v-2"></div>
          <div className="grid-v-line v-3"></div>
        </div>

        <svg className="quantum-waves" viewBox="0 0 280 60" preserveAspectRatio="none">
          <path d={areaPath} className="wave-area" />
          <path
            d={mainPath}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="telemetry-info graphical-panel" aria-label="Sound wave diagnostic panel">
        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">FREQ</span>
            <span className={`telemetry-val${freq > 700 ? ' status--err' : ''}`}>{freq} Hz</span>
          </div>
          <MeterBar val={freq} min={220} max={880} tone={tone} />
        </div>

        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">AMPL</span>
            <span className="telemetry-val">{amplitude}%</span>
          </div>
          <MeterBar val={amplitude} min={20} max={95} tone={tone} />
        </div>

        <div className="telemetry-col">
          <div className="telemetry-header">
            <span className="telemetry-label">HARM</span>
            <span className="telemetry-val">{harmonics}</span>
          </div>
          <MeterBar val={harmonics} min={1} max={6} tone={tone} />
        </div>

        <div className="telemetry-col align-right flex-status">
          <div className="telemetry-header">
            <span className="telemetry-label">MODE</span>
            <span className={`telemetry-val ${statusClass}`}>{waveStatus}</span>
          </div>
          <div className="status-graphic-ring">
            <StatusRing status={ringStatus} />
          </div>
        </div>
      </div>
    </section>
  );
}
