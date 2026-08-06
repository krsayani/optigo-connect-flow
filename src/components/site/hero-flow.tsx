import { useEffect, useState } from "react";
import { Building2, Cpu, FlaskConical, HeartPulse } from "lucide-react";

const NODES = [
  { id: "practice", label: "Practice", icon: Building2, side: "left", y: 16 },
  { id: "ehr", label: "EHR", icon: Cpu, side: "left", y: 78 },
  { id: "lab", label: "Optical Lab", icon: FlaskConical, side: "right", y: 16 },
  { id: "patient", label: "Patient", icon: HeartPulse, side: "right", y: 78 },
] as const;


const PATHS = [
  { id: "p1", d: "M 14 20 C 34 22, 38 44, 50 47", dir: 1 },
  { id: "p2", d: "M 14 74 C 34 72, 38 52, 50 50", dir: 1 },
  { id: "p3", d: "M 50 47 C 62 44, 66 22, 86 20", dir: 1 },
  { id: "p4", d: "M 50 50 C 62 52, 66 72, 86 74", dir: 1 },
] as const;

/** Animated PRACTICE / EHR -> OPTIGO -> LAB / PATIENT connectivity diagram. */
export function HeroFlow() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % 4), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-background/70 shadow-float backdrop-blur-xl">
        <div className="absolute inset-0 grid-mesh opacity-60" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-electric/15 blur-3xl animate-drift" />
        <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-aqua/15 blur-3xl animate-drift" />

        <div className="relative aspect-[16/11] w-full sm:aspect-[16/9]">
          <svg
            viewBox="0 0 100 94"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="edge" x1="0" y1="0" x2="100" y2="0">
                <stop offset="0%" stopColor="oklch(0.58 0.19 258)" stopOpacity="0.15" />
                <stop offset="50%" stopColor="oklch(0.58 0.19 258)" stopOpacity="0.65" />
                <stop offset="100%" stopColor="oklch(0.78 0.11 195)" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            {PATHS.map((p) => (
              <g key={p.id}>
                <path
                  d={p.d}
                  fill="none"
                  stroke="url(#edge)"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={p.d}
                  fill="none"
                  stroke="oklch(0.78 0.11 195)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeDasharray="2 38"
                  vectorEffect="non-scaling-stroke"
                  style={{ animation: `dash-move 2.6s linear infinite` }}
                />
              </g>
            ))}
          </svg>

          {/* Center OptiGo core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 -m-8 rounded-full bg-electric/25 blur-2xl animate-pulse-soft" />
              <div className="relative flex flex-col items-center gap-1 rounded-2xl border border-electric/30 bg-navy px-5 py-3.5 shadow-glow sm:px-7 sm:py-4">
                <span className="font-display text-sm font-extrabold tracking-tight text-on-dark sm:text-base">
                  OptiGo
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-aqua">
                  Connectivity Layer
                </span>
              </div>
              <div className="pointer-events-none absolute -inset-4 rounded-[28px] border border-electric/15" />
              <div className="pointer-events-none absolute -inset-9 rounded-[36px] border border-electric/[0.08]" />
            </div>
          </div>

          {NODES.map((n, i) => {
            const Icon = n.icon;
            const active = tick === i;
            return (
              <div
                key={n.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <div
                  className={`flex items-center gap-2 rounded-xl border bg-background/95 px-2.5 py-2 shadow-card transition-all duration-500 sm:px-3.5 sm:py-2.5 ${
                    active
                      ? "border-electric/50 shadow-glow"
                      : "border-border"
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-lg transition-colors sm:h-7 sm:w-7 ${
                      active ? "bg-electric text-primary-foreground" : "bg-muted text-navy"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="whitespace-nowrap text-[10px] font-semibold text-navy sm:text-xs">
                    {n.label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Live status ticker */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 shadow-card backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-aqua opacity-70 animate-pulse-soft" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
            </span>
            <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
              {
                [
                  "Order received from practice",
                  "Prescription data normalized",
                  "Routed to laboratory workflow",
                  "Status returned to practice + patient",
                ][tick]
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
