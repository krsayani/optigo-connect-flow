import { useEffect, useState } from "react";
import { Check, Building2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = [
  "Order Received",
  "In Production",
  "Finishing",
  "Quality Check",
  "Shipped",
  "Ready",
] as const;

const patientMessages = [
  "We've received your order.",
  "Your glasses are in production.",
  "Your lenses are being finished.",
  "Your order has completed quality inspection.",
  "Your glasses are on the way to the practice.",
  "Your glasses are ready for pickup.",
];

export function OrderTracker() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setStep((v) => (v + 1) % stages.length), 2600);
    return () => clearInterval(t);
  }, []);

  const pct = (step / (stages.length - 1)) * 100;

  return (
    <div className="mt-14 space-y-6">
      {/* Practice view */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-electric">
            <Building2 className="h-3.5 w-3.5" />
          </span>
          <p className="eyebrow">Practice view</p>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            OG-24817 · Demo Patient — A. Rivera
          </span>
        </div>

        <div className="relative mt-9">
          <div className="absolute left-0 right-0 top-[11px] h-[3px] rounded-full bg-border" />
          <div
            className="absolute left-0 top-[11px] h-[3px] rounded-full bg-gradient-to-r from-electric to-aqua transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
          <div className="relative flex justify-between">
            {stages.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <div key={s} className="flex min-w-0 flex-col items-center gap-3">
                  <span
                    className={cn(
                      "relative flex h-[25px] w-[25px] items-center justify-center rounded-full border-2 bg-background transition-all duration-500",
                      done && "border-electric bg-electric",
                      current && "border-electric shadow-glow",
                      !done && !current && "border-border",
                    )}
                  >
                    {done ? (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    ) : (
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          current ? "bg-electric animate-pulse-soft" : "bg-border",
                        )}
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      "max-w-[62px] text-center text-[10px] font-semibold leading-tight transition-colors sm:max-w-none sm:text-[11.5px]",
                      i <= step ? "text-navy" : "text-muted-foreground",
                    )}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient view */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-electric/20 surface-dark p-6 sm:p-8">
          <div className="absolute inset-0 grid-mesh-dark opacity-60" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-aqua">
                <Smartphone className="h-3.5 w-3.5" />
              </span>
              <p className="eyebrow text-aqua">Patient view</p>
            </div>
            <p className="mt-7 font-display text-xl font-bold leading-snug text-on-dark sm:text-2xl">
              “{patientMessages[step]}”
            </p>
            <div className="mt-6 flex gap-1.5">
              {stages.map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-500",
                    i <= step ? "bg-aqua" : "bg-white/15",
                  )}
                />
              ))}
            </div>
            <p className="mt-6 text-xs leading-relaxed text-on-dark-muted">
              Clear, plain-language updates — designed to reduce repetitive status calls to the
              practice.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-mist p-6 sm:p-8">
          <p className="eyebrow">Designed, not assumed</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Status detail varies across laboratory systems. OptiGo is being designed to surface
            the milestones a connected laboratory workflow can share, and to present them
            consistently to practices and patients.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Consistent status model across connected labs",
              "Practice-level and patient-level views",
              "Exceptions surfaced instead of buried",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm text-navy/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
