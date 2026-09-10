import { cn } from "@/lib/utils";
import { LensFlowMark } from "./logo";

const practiceBits = ["Rx", "Lens design", "Measurements", "Frame"];
const adapterBits = ["Map", "Validate", "Route", "Audit"];
const labBits = ["Job intake", "Production", "QC", "Ship"];
const patientBits = ["Submitted", "In lab", "Ready"];

function Lane({
  title,
  kicker,
  items,
  featured,
}: {
  title: string;
  kicker: string;
  items: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5 sm:p-6",
        featured
          ? "border-signal/35 bg-foreground text-background"
          : "border-border bg-card",
      )}
    >
      <p className={cn("font-display text-base font-semibold", featured && "text-background")}>
        {title}
      </p>
      <p
        className={cn(
          "mt-1 text-xs leading-relaxed",
          featured ? "text-background/70" : "text-muted-foreground",
        )}
      >
        {kicker}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-medium",
              featured ? "bg-white/10 text-background" : "bg-secondary text-foreground",
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdapterFlow() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
      <div className="grid gap-3">
        <Lane title="Practices & EHRs" kicker="any system, no rip-and-replace" items={practiceBits} />
        <Lane title="Patients" kicker="automatic milestone updates" items={patientBits} />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full rounded-3xl border border-signal/30 bg-accent/40 p-5 text-center sm:p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center">
            <LensFlowMark className="h-10 w-10" />
          </div>
          <p className="mt-3 font-display text-sm font-semibold">LensFlow adapter layer</p>
          <p className="mt-1 text-xs text-muted-foreground">proprietary normalization + validation</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {adapterBits.map((item) => (
              <span key={item} className="rounded-full bg-background px-3 py-1 text-[11px] font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Lane
        title="Optical labs & LMS"
        kicker="native delivery, incl. Ocuco LMS"
        items={labBits}
      />
      <p className="lg:col-span-3 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        one order object · four systems · zero re-entry
      </p>
    </div>
  );
}

export function EcosystemHub() {
  const ehrs = ["Eyefinity", "Crystal PM", "RevolutionEHR", "Compulink"];
  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
      <div className="grid gap-3">
        {ehrs.map((name) => (
          <div key={name} className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="text-sm font-semibold">{name}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              practice
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-signal/30 bg-foreground p-6 text-background">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal-soft">
          works alongside your system
        </p>
        <p className="mt-3 font-display text-2xl font-semibold">LensFlow</p>
        <p className="mt-1 text-xs text-background/65">optical infrastructure</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Order", "Validate", "Lab comms", "Tracking", "Payments", "Analytics"].map((item) => (
            <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-[11px]">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-background/50">
          routed to participating labs
        </p>
      </div>
      <div className="grid gap-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-sm font-semibold">Optical lab</p>
          <p className="mt-1 text-xs text-muted-foreground">Job received in the lab's own system</p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-sm font-semibold">Tracking + payments</p>
          <p className="mt-1 text-xs text-muted-foreground">Shared status, analytics, reconciliation</p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-sm font-semibold">Patient</p>
          <p className="mt-1 text-xs text-muted-foreground">Automatic updates to pickup</p>
        </div>
      </div>
    </div>
  );
}
