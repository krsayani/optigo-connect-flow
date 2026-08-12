import { useEffect, useState, type ComponentType } from "react";
import { ArrowRight, Building2, Cpu, Factory, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { LensesIcon } from "@/components/site/lenses-icon";

type Node = {
  id: string;
  label: string;
  sub?: string;
  icon: ComponentType<{ className?: string }>;
  accent?: boolean;
};

const FLOW: Node[] = [
  { id: "patient", label: "Patient", icon: HeartPulse },
  { id: "practice", label: "Practice", icon: Building2 },
  { id: "pms", label: "PMS", sub: "Practice Management System", icon: Cpu },
  { id: "optigo", label: "OptiGo", sub: "Verify · Route", icon: ArrowRight, accent: true },
  { id: "lms", label: "LMS", sub: "Lab Management System", icon: LensesIcon },
  { id: "lab", label: "Lab", icon: Factory },
];

const TICKER = [
  "Patient → Practice",
  "Practice → PMS",
  "PMS → OptiGo — order verified",
  "OptiGo → LMS — order routed",
  "LMS → Lab",
  "OptiGo updates PMS, LMS & Patient",
];

/** Patient → Practice → PMS → OptiGo → LMS → Lab (+ OptiGo speaks to PMS, LMS, Patient). */
export function HeroFlow() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % TICKER.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-background/70 shadow-float backdrop-blur-xl">
        <div className="absolute inset-0 grid-mesh opacity-60" />
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-electric/15 blur-3xl animate-drift" />
        <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-aqua/15 blur-3xl animate-drift" />

        <div className="relative px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-electric sm:text-[11px]">
            Order path
          </p>

          {/* Primary flow */}
          <div className="mt-5 flex items-stretch gap-1 overflow-x-auto pb-2 sm:justify-center sm:gap-1.5 sm:overflow-visible sm:pb-0">
            {FLOW.map((node, i) => {
              const Icon = node.icon;
              const active = tick === i || (tick === 5 && (node.id === "optigo" || node.id === "patient" || node.id === "pms" || node.id === "lms"));
              return (
                <div key={node.id} className="flex items-center gap-1 sm:gap-1.5">
                  <div
                    className={cn(
                      "flex min-w-[4.75rem] flex-col items-center gap-1.5 rounded-2xl border px-2.5 py-3 transition-all duration-500 sm:min-w-[5.5rem] sm:px-3",
                      node.accent
                        ? "border-electric/40 bg-navy text-on-dark shadow-glow"
                        : "border-border bg-background/95 text-navy shadow-card",
                      active && !node.accent && "border-electric/50 shadow-glow",
                      active && node.accent && "scale-[1.03]",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-lg",
                        node.accent
                          ? "bg-white/10 text-aqua"
                          : active
                            ? "bg-electric text-primary-foreground"
                            : "bg-muted text-navy",
                      )}
                    >
                      {node.accent ? (
                        <span className="font-display text-[10px] font-extrabold tracking-tight">
                          OG
                        </span>
                      ) : (
                        <Icon className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-center text-[10px] font-bold leading-tight sm:text-[11px]",
                        node.accent ? "text-on-dark" : "text-navy",
                      )}
                    >
                      {node.label}
                    </span>
                    {node.sub && (
                      <span
                        className={cn(
                          "hidden text-center text-[8px] leading-tight sm:block",
                          node.accent ? "text-aqua/90" : "text-muted-foreground",
                        )}
                      >
                        {node.sub}
                      </span>
                    )}
                  </div>
                  {i < FLOW.length - 1 && (
                    <ArrowRight
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-colors",
                        tick === i ? "text-electric" : "text-muted-foreground/50",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct OptiGo communications */}
          <div className="mt-6 rounded-2xl border border-electric/20 bg-accent/40 px-4 py-3 sm:px-5">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-electric">
              OptiGo also communicates directly with
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {[
                { label: "PMS", icon: Cpu },
                { label: "LMS", icon: LensesIcon },
                { label: "Patient", icon: HeartPulse },
              ].map((item) => {
                const Icon = item.icon;
                const highlight = tick === 5;
                return (
                  <span
                    key={item.label}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-[11px] font-semibold text-navy transition-all",
                      highlight
                        ? "border-electric/40 shadow-glow"
                        : "border-border",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 text-electric" />
                    {item.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Live status ticker */}
          <div className="mt-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 shadow-card backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-aqua opacity-70 animate-pulse-soft" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
              </span>
              <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                {TICKER[tick]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
