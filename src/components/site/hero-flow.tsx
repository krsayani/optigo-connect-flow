import { useEffect, useState, type ComponentType } from "react";
import { Building2, Factory, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

type Vertex = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Percent positions inside the diagram */
  x: string;
  y: string;
};

const VERTICES: Vertex[] = [
  { id: "patient", label: "Patient", icon: HeartPulse, x: "50%", y: "8%" },
  { id: "practice", label: "Practice", icon: Building2, x: "8%", y: "78%" },
  { id: "lab", label: "Lab", icon: Factory, x: "92%", y: "78%" },
];

const TICKER = [
  "OptiGo ↔ Patient",
  "OptiGo ↔ Practice",
  "OptiGo ↔ Lab",
  "Patient ↔ Practice ↔ Lab — via OptiGo",
];

/** Triangle: Patient, Practice, Lab at vertices; OptiGo in the middle with bidirectional links. */
export function HeroFlow() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % TICKER.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-background/70 shadow-float backdrop-blur-xl">
        <div className="absolute inset-0 grid-mesh opacity-60" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-electric/15 blur-3xl animate-drift" />
        <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-aqua/15 blur-3xl animate-drift" />

        <div className="relative px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-electric sm:text-[11px]">
            Connected network
          </p>

          <div className="relative mx-auto mt-2 aspect-[16/12] w-full max-w-xl sm:aspect-[16/11]">
            {/* Triangle + spokes */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="tri-edge" x1="0" y1="0" x2="100" y2="100">
                  <stop offset="0%" stopColor="oklch(0.58 0.19 258)" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="oklch(0.58 0.19 258)" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="oklch(0.78 0.11 195)" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Outer triangle between Patient / Practice / Lab */}
              <polygon
                points="50,18 14,78 86,78"
                fill="oklch(0.58 0.19 258 / 0.04)"
                stroke="url(#tri-edge)"
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
              <polygon
                points="50,18 14,78 86,78"
                fill="none"
                stroke="oklch(0.78 0.11 195)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="2.5 6"
                strokeLinejoin="round"
                style={{ animation: "dash-move 3s linear infinite" }}
              />

              {/* Spokes: OptiGo ↔ each vertex */}
              {[
                "M 50 50 L 50 22",
                "M 50 50 L 22 72",
                "M 50 50 L 78 72",
              ].map((d, i) => (
                <g key={d}>
                  <path
                    d={d}
                    fill="none"
                    stroke="url(#tri-edge)"
                    strokeWidth="0.55"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="oklch(0.78 0.11 195)"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                    strokeDasharray="2 28"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      animation: `dash-move ${2.2 + i * 0.25}s linear infinite`,
                      opacity: tick === i || tick === 3 ? 1 : 0.55,
                    }}
                  />
                </g>
              ))}
            </svg>

            {/* Center OptiGo */}
            <div className="absolute left-1/2 top-[48%] z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 -m-8 rounded-full bg-electric/25 blur-2xl animate-pulse-soft" />
                <div
                  className={cn(
                    "relative flex flex-col items-center gap-1 rounded-2xl border border-electric/35 bg-navy px-5 py-3.5 shadow-glow sm:px-7 sm:py-4",
                    tick === 3 && "scale-[1.03]",
                  )}
                >
                  <span className="font-display text-sm font-extrabold tracking-tight text-on-dark sm:text-base">
                    OptiGo
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-aqua">
                    Bidirectional hub
                  </span>
                </div>
              </div>
            </div>

            {/* Vertices */}
            {VERTICES.map((v, i) => {
              const Icon = v.icon;
              const active = tick === i || tick === 3;
              return (
                <div
                  key={v.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: v.x, top: v.y }}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-2xl border bg-background/95 px-3 py-2.5 shadow-card transition-all duration-500",
                      active
                        ? "border-electric/50 shadow-glow"
                        : "border-border",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                        active
                          ? "bg-electric text-primary-foreground"
                          : "bg-muted text-navy",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="pr-0.5">
                      <p className="text-[11px] font-bold leading-none text-navy sm:text-xs">
                        {v.label}
                      </p>
                      <p className="mt-1 text-[9px] font-semibold tracking-wide text-electric">
                        ↔ OptiGo
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1 flex justify-center px-2">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 shadow-card backdrop-blur">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-aqua opacity-70 animate-pulse-soft" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
              </span>
              <span className="truncate text-[10px] font-medium text-muted-foreground sm:text-xs">
                {TICKER[tick]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
