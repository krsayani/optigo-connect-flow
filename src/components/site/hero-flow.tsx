import { useEffect, useState, type ComponentType } from "react";
import { Building2, Factory, Glasses } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptiGoWordmark } from "@/components/site/logo";

type Vertex = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  x: string;
  y: string;
};

const VERTICES: Vertex[] = [
  { id: "patient", label: "Patient", icon: Glasses, x: "50%", y: "2%" },
  { id: "practice", label: "Practice", icon: Building2, x: "4%", y: "92%" },
  { id: "lab", label: "Lab", icon: Factory, x: "96%", y: "92%" },
];

const TICKER = [
  "OptiGo ↔ Patient",
  "OptiGo ↔ Practice",
  "OptiGo ↔ Lab",
  "Patient ↔ Practice ↔ Lab — via OptiGo",
];

/** Equilateral triangle picture: Patient / Practice / Lab at corners, OptiGo at center. */
export function HeroFlow() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % TICKER.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative mx-auto w-full max-w-xl">
        {/* Tall canvas so the triangle can read as the hero picture */}
        <div className="relative aspect-[10/11] w-full sm:aspect-square">
          {/* Soft glow behind the triangle */}
          <div className="absolute left-1/2 top-[42%] h-[70%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-3xl" />
          <div className="absolute bottom-[8%] left-1/2 h-40 w-[90%] -translate-x-1/2 rounded-full bg-aqua/15 blur-3xl" />

          {/* The triangle picture itself */}
          <div
            className="absolute inset-[10%_6%_14%] overflow-hidden shadow-float"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              WebkitClipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-accent/40" />
            <div className="absolute inset-0 grid-mesh opacity-50" />
            <div className="absolute -left-10 top-1/3 h-40 w-40 rounded-full bg-electric/25 blur-2xl animate-drift" />
            <div className="absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-aqua/20 blur-2xl animate-drift" />
          </div>

          {/* Triangle stroke + bidirectional edges + spokes */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-[10%_6%_14%] h-auto w-auto"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ left: "6%", right: "6%", top: "10%", bottom: "14%", width: "88%", height: "76%" }}
          >
            <defs>
              <linearGradient id="tri-stroke" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="oklch(0.58 0.19 258)" stopOpacity="0.9" />
                <stop offset="55%" stopColor="oklch(0.72 0.12 195)" stopOpacity="0.85" />
                <stop offset="100%" stopColor="oklch(0.58 0.19 258)" stopOpacity="0.75" />
              </linearGradient>
              <marker
                id="arrow-end"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.2 L 8 5 L 0 8.8 Z" fill="oklch(0.58 0.19 258)" />
              </marker>
              <marker
                id="arrow-start"
                viewBox="0 0 10 10"
                refX="2"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto"
              >
                <path d="M 10 1.2 L 2 5 L 10 8.8 Z" fill="oklch(0.58 0.19 258)" />
              </marker>
              <marker
                id="arrow-end-aqua"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.2 L 8 5 L 0 8.8 Z" fill="oklch(0.72 0.12 195)" />
              </marker>
              <marker
                id="arrow-start-aqua"
                viewBox="0 0 10 10"
                refX="2"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto"
              >
                <path d="M 10 1.2 L 2 5 L 10 8.8 Z" fill="oklch(0.72 0.12 195)" />
              </marker>
            </defs>

            {/* Bold outer triangle */}
            <polygon
              points="50,2 2,98 98,98"
              fill="none"
              stroke="url(#tri-stroke)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Edge arrows (inset from corners so markers clear vertices) */}
            {[
              { d: "M 42 18 L 16 82", key: "patient-practice" },
              { d: "M 18 94 L 82 94", key: "practice-lab" },
              { d: "M 84 82 L 58 18", key: "lab-patient" },
            ].map((edge) => (
              <g key={edge.key}>
                <path
                  d={edge.d}
                  fill="none"
                  stroke="oklch(0.58 0.19 258 / 0.45)"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  markerStart="url(#arrow-start)"
                  markerEnd="url(#arrow-end)"
                />
                <path
                  d={edge.d}
                  fill="none"
                  stroke="oklch(0.78 0.11 195 / 0.55)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeDasharray="2.2 6"
                  style={{ animation: "dash-move 3s linear infinite" }}
                />
              </g>
            ))}

            {/* Spokes to OptiGo */}
            {[
              { d: "M 50 38 L 50 18", key: "to-patient" },
              { d: "M 38 58 L 20 82", key: "to-practice" },
              { d: "M 62 58 L 80 82", key: "to-lab" },
            ].map((spoke, i) => (
              <g key={spoke.key}>
                <path
                  d={spoke.d}
                  fill="none"
                  stroke="oklch(0.58 0.19 258 / 0.55)"
                  strokeWidth="0.85"
                  strokeLinecap="round"
                  markerStart="url(#arrow-start-aqua)"
                  markerEnd="url(#arrow-end-aqua)"
                  style={{ opacity: tick === i || tick === 3 ? 1 : 0.65 }}
                />
                <path
                  d={spoke.d}
                  fill="none"
                  stroke="oklch(0.78 0.11 195)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeDasharray="2 18"
                  style={{
                    animation: `dash-move ${2.1 + i * 0.2}s linear infinite`,
                    opacity: tick === i || tick === 3 ? 1 : 0.45,
                  }}
                />
              </g>
            ))}
          </svg>

          {/* Center OptiGo */}
          <div className="absolute left-1/2 top-[52%] z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 -m-6 rounded-full bg-electric/30 blur-xl animate-pulse-soft" />
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-2xl border border-electric/40 bg-navy px-4 py-3 shadow-glow sm:px-5 sm:py-3.5",
                  tick === 3 && "scale-[1.03]",
                )}
              >
                <OptiGoWordmark tone="light" className="scale-90 sm:scale-95" />
              </div>
            </div>
          </div>

          {/* Corner nodes — sit on the triangle vertices */}
          {VERTICES.map((v, i) => {
            const Icon = v.icon;
            const active = tick === i || tick === 3;
            return (
              <div
                key={v.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: v.x, top: v.y }}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border bg-background/95 px-2.5 py-2 shadow-card transition-all duration-500 sm:px-3 sm:py-2.5",
                    active ? "border-electric/50 shadow-glow" : "border-border",
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

        <div className="mt-2 flex justify-center px-2">
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
  );
}
