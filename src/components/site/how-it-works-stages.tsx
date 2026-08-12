import { useEffect, useState } from "react";
import { Cable, GitBranch, Radar, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const steps = [
  {
    n: "01",
    title: "Patient → Practice",
    icon: Cable,
    body: "The patient order starts at the practice.",
    lane: ["Patient", "Practice"],
  },
  {
    n: "02",
    title: "Practice → PMS",
    icon: GitBranch,
    body: "The practice enters the order into its Practice Management System.",
    lane: ["Practice", "PMS"],
  },
  {
    n: "03",
    title: "PMS → OptiGo",
    icon: Radar,
    body: "OptiGo receives the order from the PMS, then verifies and routes it.",
    lane: ["PMS", "OptiGo"],
  },
  {
    n: "04",
    title: "OptiGo → LMS → Lab",
    icon: MessagesSquare,
    body: "OptiGo sends the order to the Lab Management System, which reaches the lab. OptiGo also communicates directly with PMS, LMS, and Patient.",
    lane: ["OptiGo", "LMS / Lab"],
  },
];

export function HowItWorksStages() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % steps.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-14">
      {/* animated lane */}
      <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-mist p-6 sm:p-10">
        <div className="absolute inset-0 grid-mesh opacity-70" />
        <div className="relative flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          {["Patient", "Practice", "PMS", "OptiGo", "LMS", "Lab"].map((label, i) => (
            <div key={`${label}-${i}`} className="flex flex-1 items-center gap-3">
              <div
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition-all duration-500",
                  label === "OptiGo"
                    ? "border-electric/30 bg-navy text-on-dark"
                    : "border-border bg-background text-navy",
                  active === i && "shadow-glow",
                )}
              >
                {label}
              </div>
              {i < 4 && (
                <div className="relative hidden h-px w-8 bg-border sm:block">
                  <span
                    className={cn(
                      "absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-electric transition-all duration-700",
                      active >= i ? "left-full" : "left-0",
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "h-full w-full rounded-2xl border p-6 text-left transition-all duration-400",
                active === i
                  ? "border-electric/40 bg-background shadow-float"
                  : "border-border bg-background/60 hover:border-electric/25",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                    active === i ? "bg-electric text-primary-foreground" : "bg-accent text-electric",
                  )}
                >
                  <s.icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="mt-5 text-base font-semibold uppercase tracking-wide text-navy">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              <p className="mt-4 font-mono text-[10.5px] text-electric">
                {s.lane[0]} → {s.lane[1]}
              </p>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
