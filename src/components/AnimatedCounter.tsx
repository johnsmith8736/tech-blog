import { useCallback, useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

function scramble(str: string): string {
  return str
    .split('')
    .map((c) => (/[0-9]/.test(c) ? '0123456789'[Math.floor(Math.random() * 10)] : c))
    .join('');
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(String(value));
  const [glitching, setGlitching] = useState(false);
  const prevRef = useRef(value);
  const mounted = useRef(true);

  // ── transition animation: scramble → settle ──
  const animateTransition = useCallback((target: number) => {
    const steps = 6;
    const msPerStep = 40;
    let step = 0;

    setGlitching(true);

    const tick = () => {
      step++;
      if (step < steps) {
        setDisplay(scramble(String(target)));
        setTimeout(tick, msPerStep);
      } else {
        setDisplay(String(target));
        setGlitching(false);
      }
    };

    tick();
  }, []);

  // ── watch for value changes ──
  useEffect(() => {
    if (prevRef.current === value) return;
    prevRef.current = value;
    animateTransition(value);
  }, [value, animateTransition]);

  // ── random scramble flicker ──
  useEffect(() => {
    mounted.current = true;

    const scheduleGlitch = () => {
      if (!mounted.current) return;
      const delay = 1800 + Math.random() * 2000;

      setTimeout(() => {
        if (!mounted.current) return;
        const current = String(value);
        setDisplay(scramble(current));
        setGlitching(true);

        setTimeout(() => {
          if (!mounted.current) return;
          setDisplay(current);
          setGlitching(false);
          scheduleGlitch();
        }, 80);
      }, delay);
    };

    scheduleGlitch();

    return () => {
      mounted.current = false;
    };
  }, [value]);

  return (
    <strong
      className={`animated-counter${className ? ` ${className}` : ''}${glitching ? ' is-glitching' : ''}`}
    >
      {display}
    </strong>
  );
}
