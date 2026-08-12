import { useEffect, useState, type ComponentType } from "react";
import { Building2, Factory, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptiGoWordmark } from "@/components/site/logo";

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
                <marker
                  id="arrow-end"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="4.5"
                  markerHeight="4.5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.2 L 8 5 L 0 8.8 Z" fill="oklch(0.58 0.19 258)" />
                </marker>
                <marker
                  id="arrow-start"
                  viewBox="0 0 10 10"
                  refX="2"
                  refY="5"
                  markerWidth="4.5"
                  markerHeight="4.5"
                  orient="auto"
                >
                  <path d="M 10 1.2 L 2 5 L 10 8.8 Z" fill="oklch(0.58 0.19 258)" />
                </marker>
                <marker
                  id="arrow-end-aqua"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="4.5"
                  markerHeight="4.5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.2 L 8 5 L 0 8.8 Z" fill="oklch(0.72 0.12 195)" />
                </marker>
                <marker
                  id="arrow-start-aqua"
                  viewBox="0 0 10 10"
                  refX="2"
                  refY="5"
                  markerWidth="4.5"
                  markerHeight="4.5"
                  orient="auto"
                >
                  <path d="M 10 1.2 L 2 5 L 10 8.8 Z" fill="oklch(0.72 0.12 195)" />
                </marker>
              </defs>

              {/* Outer triangle edges with ↔ arrows */}
              {[
                // Patient ↔ Practice
                { d: "M 46 24 L 22 70", key: "patient-practice" },
                // Practice ↔ Lab
                { d: "M 22 78 L 78 78", key: "practice-lab" },
                // Lab ↔ Patient
                { d: "M 78 70 L 54 24", key: "lab-patient" },
              ].map((edge) => (
                <g key={edge.key}>
                  <path
                    d={edge.d}
                    fill="none"
                    stroke="url(#tri-edge)"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    markerStart="url(#arrow-start)"
                    markerEnd="url(#arrow-end)"
                  />
                  <path
                    d={edge.d}
                    fill="none"
                    stroke="oklch(0.78 0.11 195 / 0.55)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="2.5 7"
                    style={{ animation: "dash-move 3s linear infinite" }}
                  />
                </g>
              ))}

              {/* Soft triangle fill */}
              <polygon
                points="50,18 14,78 86,78"
                fill="oklch(0.58 0.19 258 / 0.035)"
                stroke="none"
              />

              {/* Spokes: OptiGo ↔ each vertex with ↔ arrows */}
              {[
                // to Patient (shorten so arrows clear the hub/node)
                { d: "M 50 40 L 50 24", key: "to-patient" },
                // to Practice
                { d: "M 40 56 L 26 70", key: "to-practice" },
                // to Lab
                { d: "M 60 56 L 74 70", key: "to-lab" },
              ].map((spoke, i) => (
                <g key={spoke.key}>
                  <path
                    d={spoke.d}
                    fill="none"
                    stroke="url(#tri-edge)"
                    strokeWidth="0.85"
                    strokeLinecap="round"
                    markerStart="url(#arrow-start-aqua)"
                    markerEnd="url(#arrow-end-aqua)"
                    style={{
                      opacity: tick === i || tick === 3 ? 1 : 0.7,
                    }}
                  />
                  <path
                    d={spoke.d}
                    fill="none"
                    stroke="oklch(0.78 0.11 195)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeDasharray="2 20"
                    style={{
                      animation: `dash-move ${2.1 + i * 0.2}s linear infinite`,
                      opacity: tick === i || tick === 3 ? 1 : 0.5,
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
                    "relative flex items-center justify-center rounded-2xl border border-electric/35 bg-navy px-5 py-3.5 shadow-glow sm:px-6 sm:py-4",
                    tick === 3 && "scale-[1.03]",
                  )}
                >
                  <OptiGoWordmark tone="light" className="scale-95 sm:scale-100" />
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
