import { AlertTriangle, ArrowDown, Check, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";

const todaySteps = [
  "Patient purchases eyewear",
  "Order information lives in practice software",
  "Staff enters information into another system",
  "Order is submitted to a laboratory",
  "Staff checks order status",
  "Patient calls the practice",
  "Practice contacts the laboratory",
  "Updates are manually communicated",
];

const painPoints = [
  "Manual data entry",
  "Disconnected systems",
  "Order-status calls",
  "Duplicate work",
  "Limited visibility",
  "Patient follow-up",
  "Staff time",
];

const optigoSteps = [
  "Order originates in the practice",
  "OptiGo normalizes and routes the order",
  "Laboratory workflow receives a clean handoff",
  "Status flows back to practice and patient",
];

export function ProblemContrast() {
  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-4">
      {/* TODAY */}
      <Reveal className="relative rounded-3xl border border-border bg-background p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Today</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">
            <AlertTriangle className="h-3 w-3" /> Fragmented
          </span>
        </div>

        <ol className="mt-6 space-y-2">
          {todaySteps.map((step, i) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-xl border border-dashed border-border/80 bg-muted/40 px-3.5 py-2.5"
              style={{ marginLeft: `${(i % 3) * 10}px` }}
            >
              <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-snug text-navy/80">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-2">
          {painPoints.map((p) => (
            <span
              key={p}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </Reveal>

      {/* TRANSITION */}
      <Reveal delay={120} className="flex items-center justify-center lg:px-2">
        <div className="flex flex-col items-center gap-3 lg:h-full lg:justify-center">
          <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-electric/40 to-transparent lg:block" />
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-electric/30 bg-background shadow-glow">
            <ArrowDown className="h-4 w-4 text-electric lg:-rotate-90" />
          </div>
          <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-electric/40 to-transparent lg:block" />
        </div>
      </Reveal>

      {/* WITH OPTIGO */}
      <Reveal
        delay={200}
        className="relative overflow-hidden rounded-3xl border border-electric/20 surface-dark p-6 sm:p-8"
      >
        <div className="absolute inset-0 grid-mesh-dark opacity-70" />
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-aqua/15 blur-3xl animate-drift" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-aqua">With OptiGo</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-aqua">
              <Sparkles className="h-3 w-3" /> Connected
            </span>
          </div>

          <h3 className="mt-6 text-2xl font-bold text-on-dark sm:text-3xl">
            One connected workflow.
          </h3>

          <ol className="mt-6 space-y-3">
            {optigoSteps.map((step) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-sm"
              >
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-aqua/90">
                  <Check className="h-2.5 w-2.5 text-navy-deep" />
                </span>
                <span className="text-sm leading-snug text-on-dark">{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-7 text-sm leading-relaxed text-on-dark-muted">
            Fewer handoffs. Fewer re-entries. One place to understand where every optical
            order stands.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
