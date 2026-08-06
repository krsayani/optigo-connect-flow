import { useEffect, useState } from "react";
import { Building2, Cpu, FlaskConical, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const ring = [
  { label: "Practice", icon: Building2, angle: 225 },
  { label: "EHR", icon: Cpu, angle: 315 },
  { label: "Laboratory", icon: FlaskConical, angle: 45 },
  { label: "Patient", icon: HeartPulse, angle: 135 },
];

export function InfrastructureGraphic() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % ring.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-0 grid-mesh-dark rounded-full opacity-50" />
      {[0.55, 0.78, 1].map((s, i) => (
        <div
          key={s}
          className="absolute rounded-full border border-white/10"
          style={{
            inset: `${(1 - s) * 50}%`,
            animation: `pulse-soft ${5 + i}s ease-in-out infinite`,
          }}
        />
      ))}

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {ring.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = 50 + Math.cos(rad) * 36;
          const y = 50 + Math.sin(rad) * 36;
          return (
            <g key={n.label}>
              <line
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="oklch(0.72 0.13 250 / 0.28)"
                strokeWidth="0.4"
              />
              <line
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="oklch(0.78 0.11 195)"
                strokeWidth="0.9"
                strokeLinecap="round"
                strokeDasharray="2 30"
                style={{ animation: "dash-move 2.4s linear infinite" }}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-electric/25 blur-3xl animate-pulse-soft" />
          <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-electric/40 bg-navy-deep shadow-glow sm:h-28 sm:w-28">
            <span className="font-display text-base font-extrabold text-on-dark sm:text-lg">
              OptiGo
            </span>
            <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-aqua">
              Core
            </span>
          </div>
        </div>
      </div>

      {ring.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const left = 50 + Math.cos(rad) * 38;
        const top = 50 + Math.sin(rad) * 38;
        const Icon = n.icon;
        return (
          <div
            key={n.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-2.5 py-2 backdrop-blur-md transition-all duration-500",
                active === i
                  ? "border-aqua/50 bg-white/[0.12] shadow-glow"
                  : "border-white/12 bg-white/[0.05]",
              )}
            >
              <Icon
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  active === i ? "text-aqua" : "text-on-dark-muted",
                )}
              />
              <span className="whitespace-nowrap text-[11px] font-semibold text-on-dark">
                {n.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
