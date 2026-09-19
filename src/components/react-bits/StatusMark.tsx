import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, useMotionValue, useReducedMotion } from 'framer-motion';
import './StatusMark.css';

export type StatusMarkStatus = 'pending' | 'running' | 'done' | 'failed' | 'cancelled';

export interface StatusMarkProps {
  status?: StatusMarkStatus;
  progress?: number;
  label?: React.ReactNode;
  color?: string;
  doneColor?: string;
  errorColor?: string;
  size?: number;
  strokeWidth?: number;
  dashes?: number;
  fontSize?: number;
  spinDuration?: number;
  arcLength?: number;
  drawDuration?: number;
  fillOpacity?: number;
  strike?: boolean;
  strikeDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const UI = { type: 'spring', duration: 0.3, bounce: 0 };
const MORPH = { duration: 0.3, ease: [0.77, 0, 0.175, 1] };
const CHECK = 'M7.5 12.25 10.5 15.25 16.75 8.75';
const CROSS = 'M8.5 8.5 15.5 15.5M15.5 8.5 8.5 15.5';
const TEXT: Record<StatusMarkStatus, string> = {
  pending: 'Pending',
  running: 'In progress',
  done: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};
const IDLE_DASH = 0.3;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export default function StatusMark({
  status = 'pending',
  progress,
  label,
  color = 'currentColor',
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  size = 20,
  strokeWidth = 2,
  dashes = 8,
  fontSize = 14,
  spinDuration = 1100,
  arcLength = 0.68,
  drawDuration = 240,
  fillOpacity = 0.06,
  strike = true,
  strikeDelay = 60,
  className = '',
  style,
}: StatusMarkProps) {
  const reduce = useReducedMotion();
  const r = 10 - strokeWidth / 2;
  const C = 2 * Math.PI * r;
  const P = C / Math.max(1, dashes);
  const determinate = status === 'running' && Number.isFinite(progress);
  const indeterminate = status === 'running' && !determinate;
  const solid = status === 'running' || status === 'done' || status === 'failed';
  const targetArc = indeterminate ? arcLength : determinate ? clamp01(progress!) : 1;

  const mode = useMotionValue(solid ? 1 : 0);
  const arc = useMotionValue(targetArc);
  const travel = useMotionValue(0);
  const ringRef = useRef<SVGCircleElement>(null);
  const geo = useRef({ C, P });
  geo.current = { C, P };
  const gen = useRef(0);

  const writeDash = () => {
    const g = geo.current;
    const m = mode.get();
    const a = arc.get();
    const dash = IDLE_DASH * g.P + (a * g.C - IDLE_DASH * g.P) * m;
    const gap = (1 - IDLE_DASH) * g.P + ((1 - a) * g.C - (1 - IDLE_DASH) * g.P) * m;
    ringRef.current?.setAttribute('stroke-dasharray', `${Math.max(0, dash)} ${Math.max(0, gap)}`);
  };

  useLayoutEffect(() => {
    writeDash();
    ringRef.current?.setAttribute('stroke-dashoffset', String(travel.get()));
  }, [C, P]);

  useEffect(() => {
    const offs = [
      mode.on('change', writeDash),
      arc.on('change', writeDash),
      travel.on('change', (v) => ringRef.current?.setAttribute('stroke-dashoffset', String(v))),
    ];
    return () => {
      offs.forEach((off) => off());
      mode.stop();
      arc.stop();
      travel.stop();
    };
  }, []);

  useEffect(() => {
    const g = ++gen.current;
    if (reduce) {
      if ((mode as any).jump) (mode as any).jump(solid ? 1 : 0);
      else mode.set(solid ? 1 : 0);
      if ((arc as any).jump) (arc as any).jump(targetArc);
      else arc.set(targetArc);
      if ((travel as any).jump) (travel as any).jump(0);
      else travel.set(0);
      return;
    }
    if (mode.get() === 0) {
      if ((arc as any).jump) (arc as any).jump(targetArc);
      else arc.set(targetArc);
    }
    animate(mode as any, (solid ? 1 : 0) as any, MORPH as any);
    animate(arc as any, targetArc as any, UI as any);
    if (indeterminate) {
      const t0 = travel.get();
      animate(travel as any, [t0, t0 - C] as any, { duration: spinDuration / 1000, ease: 'linear', repeat: Infinity } as any);
      return;
    }
    const unit = determinate ? C : P;
    const to = Math.floor(travel.get() / unit) * unit;
    animate(travel as any, to as any, UI as any).then(() => {
      if (gen.current === g) {
        if ((travel as any).jump) (travel as any).jump(0);
        else travel.set(0);
      }
    });
  }, [status, determinate, targetArc, reduce, C, P, spinDuration]);

  const spoken = TEXT[status] + (determinate ? `, ${Math.round(clamp01(progress!) * 100)}%` : '');
  const hasLabel = label !== undefined && label !== null;

  return (
    <span
      className={`status-mark${className ? ` ${className}` : ''}`}
      data-status={status}
      data-indeterminate={indeterminate ? '' : undefined}
      data-strike={strike ? '' : undefined}
      style={
        {
          '--sm-size': `${size}px`,
          '--sm-stroke': strokeWidth,
          '--sm-color': color,
          '--sm-done': doneColor,
          '--sm-error': errorColor,
          '--sm-fill': fillOpacity,
          '--sm-font': `${fontSize}px`,
          '--sm-draw': `${drawDuration}ms`,
          '--sm-strike-delay': `${120 + strikeDelay}ms`,
          ...style,
        } as React.CSSProperties
      }
    >
      <svg
        className="status-mark__glyph"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        role={hasLabel ? undefined : 'img'}
        aria-label={hasLabel ? undefined : spoken}
        aria-hidden={hasLabel || undefined}
      >
        <circle className="status-mark__track" cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <circle ref={ringRef} className="status-mark__ring" cx="12" cy="12" r={r} transform="rotate(-90 12 12)" />
        <path className="status-mark__check" d={CHECK} pathLength="1" />
        <path className="status-mark__cross" d={CROSS} pathLength="1" />
      </svg>
      {hasLabel ? <span className="status-mark__sr">{spoken}: </span> : null}
      {hasLabel ? (
        <span className="status-mark__label">
          {label}
          <span className="status-mark__strike" aria-hidden="true" />
        </span>
      ) : null}
    </span>
  );
}
