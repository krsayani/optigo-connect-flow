import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

const STAGES = [
  "Order sent to lab",
  "Edging & production",
  "Shipped to practice",
  "Quality check",
  "Ready for pickup",
];

function Glasses({ fill }: { fill: number }) {
  const uid = useId().replace(/:/g, "");
  const left = `lf-lens-l-${uid}`;
  const right = `lf-lens-r-${uid}`;
  const lift = -6 - fill * 18;

  return (
    <svg
      viewBox="0 0 240 130"
      className="h-[168px] w-auto drop-shadow-[0_28px_38px_rgba(0,0,0,0.55)] sm:h-[200px]"
    >
      <defs>
        <clipPath id={left}>
          <rect x="20" y="30" width="80" height="56" rx="26" />
        </clipPath>
        <clipPath id={right}>
          <rect x="140" y="30" width="80" height="56" rx="26" />
        </clipPath>
        <linearGradient id={`lf-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--signal-soft)" />
          <stop offset="55%" stopColor="var(--signal)" />
          <stop offset="100%" stopColor="var(--violet)" />
        </linearGradient>
        <linearGradient id={`lf-frame-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="var(--signal-soft)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--violet)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`lf-glare-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`lf-soft-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <g filter={`url(#lf-soft-${uid})`} opacity="0.18">
        <rect x="24" y="34" width="72" height="48" rx="24" fill="var(--signal)" />
        <rect x="144" y="34" width="72" height="48" rx="24" fill="var(--violet)" />
      </g>
      <path
        d="M20 52 L2 40"
        stroke={`url(#lf-frame-${uid})`}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M220 52 L238 40"
        stroke={`url(#lf-frame-${uid})`}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M100 50 C112 39 128 39 140 50"
        fill="none"
        stroke={`url(#lf-frame-${uid})`}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {[
        { clip: left, x: 20, wave: "M-60 86" },
        { clip: right, x: 140, wave: "M60 86" },
      ].map((lens) => (
        <g key={lens.clip} clipPath={`url(#${lens.clip})`}>
          <rect x={lens.x} y="30" width="80" height="56" fill="#050b16" opacity="0.55" />
          <g style={{ transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)", transform: `translateY(${lift}px)` }}>
            <rect x={lens.x} y="86" width="80" height="60" fill={`url(#lf-fill-${uid})`} opacity="0.9" />
            <g className="animate-wavey">
              <path
                d={`${lens.wave} q 20 -6 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 L${lens.x + 160} 96 L${lens.x - 80} 96 Z`}
                fill={`url(#lf-fill-${uid})`}
                opacity="0.9"
              />
            </g>
            <rect x={lens.x} y="85" width="80" height="1.6" fill="#ffffff" opacity="0.85" />
          </g>
          <rect x={lens.x} y="30" width="80" height="56" fill={`url(#lf-glare-${uid})`} opacity="0.35" />
        </g>
      ))}
      <rect
        x="20"
        y="30"
        width="80"
        height="56"
        rx="26"
        fill="none"
        stroke={`url(#lf-frame-${uid})`}
        strokeWidth="3.2"
      />
      <rect
        x="140"
        y="30"
        width="80"
        height="56"
        rx="26"
        fill="none"
        stroke={`url(#lf-frame-${uid})`}
        strokeWidth="3.2"
      />
      <ellipse
        cx="120"
        cy="114"
        rx="86"
        ry="7"
        fill="var(--signal)"
        opacity="0.18"
        filter={`url(#lf-soft-${uid})`}
      />
    </svg>
  );
}

export function OrderStatusCard({ caption }: { caption?: string }) {
  const [active, setActive] = useState(4);
  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % STAGES.length), 2400);
    return () => clearInterval(t);
  }, []);

  const progress = (active + 1) / STAGES.length;
  const c = 2 * Math.PI * 26;
  const offset = c * (1 - progress);

  return (
    <div className="scene hud-panel relative w-full overflow-hidden rounded-[2rem] p-6 sm:p-9">
      <div aria-hidden className="hud-grid pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, color-mix(in oklab, var(--signal) 55%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, color-mix(in oklab, var(--violet) 50%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex items-center justify-between gap-4">
        <p className="font-display text-lg font-semibold text-white sm:text-xl">
          Order status, in real time.
        </p>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-signal/40 bg-white/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-signal-soft backdrop-blur">
          <span className="animate-blip h-1.5 w-1.5 rounded-full bg-signal" />
          live
        </span>
      </div>
      <div className="relative mt-8 grid items-center gap-10 md:grid-cols-[1fr_1.15fr]">
        <div className="relative mx-auto">
          <div className="d3 animate-float relative" style={{ transform: "rotateX(16deg)" }}>
            <Glasses fill={progress} />
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 text-white/80">
            <svg viewBox="0 0 64 64" className="h-12 w-12 -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="5" />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="var(--signal-soft)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
              />
            </svg>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
              {STAGES[active]} 🎉
            </span>
          </div>
        </div>
        <ul className="space-y-2.5">
          {STAGES.map((stage, i) => {
            const done = i < active;
            const live = i === active;
            return (
              <li
                key={stage}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-sm",
                  live
                    ? "border-signal/40 bg-white/8 text-white"
                    : "border-white/10 bg-white/4 text-white/70",
                )}
              >
                <span className="inline-flex items-center gap-2.5">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      live ? "animate-blip bg-signal" : done ? "bg-signal-soft" : "bg-white/25",
                    )}
                  />
                  {stage}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {live ? "live" : done ? "done" : "—"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      {caption ? (
        <p className="relative mt-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
