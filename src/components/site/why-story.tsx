import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  Check,
  ClipboardList,
  Glasses,
  HelpCircle,
  Keyboard,
  Monitor,
  Phone,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal, useReveal } from "./reveal";
import { CTAButton } from "./primitives";

/* ---------------- helpers ---------------- */

function useInViewOnce<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StepLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] tracking-[0.2em] text-electric">{n}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-electric/40 to-transparent" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

/* ---------------- STEP 1: re-entry ---------------- */

function StepReentry() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="story-3d">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="pop-card rounded-2xl border border-border bg-background p-5 shadow-float">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-navy">
            <ClipboardList className="h-3.5 w-3.5 text-electric" /> Practice / EHR
          </span>
          <div className="mt-4 space-y-1.5">
            {["Prescription", "Lens design", "Measurements"].map((f) => (
              <div
                key={f}
                className="flex items-center justify-between rounded-lg border border-border/70 bg-mist px-3 py-2 text-[11.5px] text-navy/80"
              >
                <span>{f}</span>
                <Check className="h-3 w-3 text-electric" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="flex flex-col items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-navy shadow-card animate-buzz">
              <Keyboard className="h-4 w-4" />
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
              re-entered
            </span>
          </div>
        </div>

        <div className="pop-card rounded-2xl border border-dashed border-border bg-muted/50 p-5">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-navy">
            <Glasses className="h-3.5 w-3.5 text-muted-foreground" /> Lab portal
          </span>
          <div className="mt-4 space-y-1.5">
            {["Prescription", "Lens design", "Measurements"].map((f, i) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/70 px-3 py-2"
              >
                <span className="text-[11.5px] text-muted-foreground">{f}</span>
                <span className="relative ml-auto h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-electric/50"
                    style={{
                      width: inView ? "100%" : "0%",
                      transition: `width 900ms cubic-bezier(.22,1,.36,1) ${300 + i * 260}ms`,
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STEP 2: black box ---------------- */

function StepBlackBox() {
  return (
    <div className="story-3d relative overflow-hidden rounded-3xl border border-electric/20 surface-dark p-6 sm:p-8">
      <div className="absolute inset-0 grid-mesh-dark opacity-60" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-electric/20 blur-3xl animate-drift" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-on-dark sm:text-2xl">
            Then the order disappears into the process.
          </h3>
          <p className="mt-3 text-sm text-on-dark-muted">
            The practice and patient often don't have one place to follow the journey.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {["Practice", "Lab"].map((l) => (
            <div key={l} className="flex items-center gap-3">
              <div className="pop-card rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3 text-xs font-semibold text-on-dark backdrop-blur-md">
                {l}
              </div>
              <ArrowRight className="h-4 w-4 text-aqua/70" />
            </div>
          ))}
          <div className="relative">
            <span className="absolute -inset-5 rounded-full bg-aqua/15 blur-2xl animate-pulse-soft" />
            <div className="pop-card relative flex h-14 w-14 items-center justify-center rounded-2xl border border-aqua/40 bg-white/[0.08] backdrop-blur-md">
              <HelpCircle className="h-6 w-6 text-aqua animate-pulse-soft" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STEP 3: the phone call ---------------- */

const chores = [
  "Check the practice system",
  "Check another portal",
  "Contact the laboratory",
  "Respond to the patient",
];

function StepCall() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.3);
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setSecs((v) => (v >= 214 ? 0 : v + 2)), 60);
    return () => clearInterval(t);
  }, [inView]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <div ref={ref} className="story-3d grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-12">
      {/* phone */}
      <div className="mx-auto w-full max-w-[280px]">
        <div className="pop-card-tilt rounded-[2rem] border border-border bg-background p-3 shadow-float">
          <div className="rounded-[1.5rem] surface-dark p-5">
            <div className="flex justify-between font-mono text-[9px] text-on-dark-muted">
              <span>Incoming call</span>
              <span>now</span>
            </div>
            <div className="mt-6 flex flex-col items-center text-center">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-aqua/40 bg-white/[0.08]">
                <span className="absolute inset-0 rounded-full border border-aqua/40 animate-ring-ping" />
                <Phone className="h-5 w-5 text-aqua" />
              </span>
              <p className="mt-4 text-sm font-semibold text-on-dark">Patient</p>
              <p className="mt-2 text-[12px] leading-relaxed text-on-dark-muted">
                “Are my glasses ready yet?”
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/90">
                <X className="h-4 w-4 text-on-dark" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-aqua animate-pulse-soft">
                <Phone className="h-4 w-4 text-navy-deep" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-navy sm:text-3xl">
          One simple question creates more work.
        </h3>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {chores.map((c, i) => (
            <div
              key={c}
              className="pop-card flex items-center gap-3 rounded-xl border border-border bg-background px-3.5 py-2.5"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(10px)",
                transition: `all 500ms cubic-bezier(.22,1,.36,1) ${i * 160}ms`,
              }}
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[12.5px] text-navy/80">{c}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-mist px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-soft" />
          <span className="font-mono text-lg font-semibold tabular-nums text-navy">
            {mm}:{ss}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            staff time, one call
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STEP 4: multiply ---------------- */

const clutter = [
  { t: "Status check", l: "6%", top: "8%", d: 0 },
  { t: "Patient call", l: "52%", top: "4%", d: 200 },
  { t: "Where is order #4182?", l: "24%", top: "30%", d: 420 },
  { t: "Re-enter Rx", l: "66%", top: "34%", d: 640 },
  { t: "Lab portal login", l: "8%", top: "56%", d: 820 },
  { t: "Callback requested", l: "44%", top: "62%", d: 1000 },
  { t: "Missing coating info", l: "70%", top: "76%", d: 1180 },
  { t: "Follow up tomorrow", l: "18%", top: "80%", d: 1340 },
];

function StepMultiply() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.25);
  const [count, setCount] = useState(1);
  useEffect(() => {
    if (!inView) return;
    const seq = [1, 5, 15, 32];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setCount(seq[i]!);
    }, 1100);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div ref={ref} className="story-3d grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.2fr] lg:items-center">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-5xl font-extrabold tabular-nums text-gradient sm:text-6xl">
            {count}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">status questions</span>
        </div>
        <p className="mt-4 text-lg font-bold leading-snug text-navy sm:text-xl">
          Multiply it across every order. Every week. Every location.
        </p>
      </div>

      <div className="relative h-[260px] overflow-hidden rounded-3xl border border-border bg-mist sm:h-[300px]">
        <div className="absolute inset-0 grid-mesh opacity-70" />
        {clutter.map((c) => (
          <div
            key={c.t}
            className="pop-card absolute flex items-center gap-2 rounded-xl border border-border bg-background/95 px-3 py-2 shadow-card backdrop-blur"
            style={{
              left: c.l,
              top: c.top,
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "scale(0.85) translateY(14px)",
              transition: `all 600ms cubic-bezier(.22,1,.36,1) ${c.d}ms`,
              animation: inView ? `float-soft ${4 + (c.d % 5) * 0.4}s ease-in-out infinite` : undefined,
            }}
          >
            <Bell className="h-3 w-3 text-destructive" />
            <span className="whitespace-nowrap text-[11px] font-medium text-navy/80">{c.t}</span>
          </div>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-mist to-transparent" />
      </div>
    </div>
  );
}

/* ---------------- TRANSITION ---------------- */

function BetterWay() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="relative flex min-h-[28vh] flex-col items-center justify-center px-5 py-16 text-center sm:py-20"
    >
      <p
        className={cn(
          "text-3xl font-bold leading-tight text-navy transition-all duration-1000 sm:text-4xl",
          shown ? "opacity-100 blur-0" : "translate-y-3 opacity-0 blur-sm",
        )}
      >
        There should be a better way.
      </p>
      <div
        className={cn(
          "mt-10 transition-all duration-1000 delay-500",
          shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <span className="font-display text-4xl font-extrabold tracking-tight text-gradient sm:text-5xl">
          OptiGo
        </span>
      </div>
    </div>
  );
}

/* ---------------- SECTION 2: the OptiGo experience ---------------- */

const patientUpdates = [
  { label: "Order submitted", stage: 0 },
  { label: "Lab received order", stage: 1 },
  { label: "In production", stage: 2 },
  { label: "Ready for pickup", stage: 3 },
];

function OptigoFlow() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.3);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setPhase((v) => (v + 1) % 5), 1200);
    return () => clearInterval(t);
  }, [inView]);

  const visibleUpdates = phase;

  const ehrActive = phase === 0;
  const hubActive = phase === 1 || phase === 2 || phase === 3;
  const labActive = phase === 2;
  const patientActive = phase === 3 || phase === 4;

  return (
    <div ref={ref} className="story-3d">
      <div className="relative overflow-hidden rounded-3xl border border-electric/20 surface-dark p-6 sm:p-8">
        <div className="absolute inset-0 grid-mesh-dark opacity-60" />
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-aqua/15 blur-3xl animate-drift" />
        <div
          className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-electric/10 blur-3xl animate-drift"
          style={{ animationDelay: "-6s" }}
        />

        <div className="relative text-center">
          <h3 className="text-xl font-bold text-on-dark sm:text-2xl">One entry. Every loop closed.</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-on-dark-muted">
            Enter the order once in your EHR. OptiGo routes it to the lab and keeps the patient
            informed at every step.
          </p>
        </div>

        {/* Desktop hub-and-spoke diagram */}
        <div className="relative mx-auto mt-10 hidden max-w-4xl lg:block">
          <svg
            viewBox="0 0 800 500"
            className="h-auto w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lineEhr" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--electric-soft)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--aqua)" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="lineLab" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--aqua)" stopOpacity="0.85" />
                <stop offset="100%" stopColor="var(--electric-soft)" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="linePatient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--aqua)" stopOpacity="0.85" />
                <stop offset="100%" stopColor="var(--electric-soft)" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            <path
              id="pEhr"
              d="M 190 130 L 330 130"
              stroke="url(#lineEhr)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              opacity="0.6"
            />
            <path
              id="pLab"
              d="M 470 130 L 610 130"
              stroke="url(#lineLab)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              opacity="0.6"
            />
            <path
              id="pPatient"
              d="M 400 175 L 400 340"
              stroke="url(#linePatient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 6"
              opacity="0.6"
            />

            <circle r="4" fill="var(--aqua)">
              <animateMotion dur="2s" repeatCount="indefinite">
                <mpath href="#pEhr" />
              </animateMotion>
            </circle>
            <circle r="4" fill="var(--aqua)">
              <animateMotion dur="2s" begin="0.6s" repeatCount="indefinite">
                <mpath href="#pLab" />
              </animateMotion>
            </circle>
            <circle r="4" fill="var(--electric-soft)">
              <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite">
                <mpath href="#pPatient" />
              </animateMotion>
            </circle>
          </svg>

          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto absolute left-[10%] top-[22%] w-36 -translate-x-1/2 sm:w-44">
              <div
                className={cn(
                  "pop-card rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-center backdrop-blur-md transition-all duration-500",
                  ehrActive && "border-electric/40 shadow-glow",
                )}
              >
                <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-on-dark">
                  <Monitor className="h-5 w-5" />
                </span>
                <p className="mt-3 text-xs font-semibold text-on-dark">Practice EHR</p>
                <p className="mt-1 text-[10px] text-on-dark-muted">Enter once</p>
              </div>
            </div>

            <div className="pointer-events-auto absolute left-1/2 top-[16%] w-40 -translate-x-1/2 sm:w-48">
              <div
                className={cn(
                  "pop-card relative rounded-2xl border border-aqua/40 bg-white/[0.1] p-5 text-center backdrop-blur-md transition-all duration-500",
                  hubActive && "shadow-glow",
                )}
              >
                <div className="absolute inset-0 rounded-2xl bg-aqua/10 blur-xl" />
                <span className="relative mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-aqua/30 bg-aqua/20 text-aqua">
                  <Sparkles className="h-6 w-6" />
                </span>
                <p className="relative mt-3 font-display text-lg font-bold text-aqua">OptiGo</p>
                <p className="relative mt-1 text-[10px] text-on-dark-muted">Routes & updates</p>
              </div>
            </div>

            <div className="pointer-events-auto absolute right-[10%] top-[22%] w-36 translate-x-1/2 sm:w-44">
              <div
                className={cn(
                  "pop-card rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-center backdrop-blur-md transition-all duration-500",
                  labActive && "border-electric/40 shadow-glow",
                )}
              >
                <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-on-dark">
                  <Glasses className="h-5 w-5" />
                </span>
                <p className="mt-3 text-xs font-semibold text-on-dark">Optical Lab</p>
                <p className="mt-1 text-[10px] text-on-dark-muted">Receives order</p>
              </div>
            </div>

            <div className="pointer-events-auto absolute left-1/2 top-[56%] w-44 -translate-x-1/2 sm:w-52">
              <div
                className={cn(
                  "pop-card rounded-[2rem] border border-white/12 bg-white/[0.06] p-2.5 backdrop-blur-md transition-all duration-500",
                  patientActive && "border-electric/40 shadow-glow",
                )}
              >
                <div className="rounded-[1.5rem] bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy">
                      <Smartphone className="h-3 w-3 text-electric" /> Patient
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">live</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {patientUpdates.map((u, i) => (
                      <div
                        key={u.label}
                        className="flex items-start gap-2 rounded-xl border border-border bg-mist px-3 py-2"
                        style={{
                          opacity: visibleUpdates > i ? 1 : 0.5,
                          transform: visibleUpdates > i ? "none" : "translateY(4px)",
                          transition: "all 400ms cubic-bezier(.22,1,.36,1)",
                        }}
                      >
                        <span
                          className={cn(
                            "mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
                            visibleUpdates > i ? "bg-electric" : "bg-muted",
                          )}
                        >
                          <Check className="h-2 w-2 text-primary-foreground" />
                        </span>
                        <span className="text-[11px] leading-snug text-navy/85">{u.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile vertical flow */}
        <div className="relative mt-10 flex flex-col items-center gap-3 lg:hidden">
          <div
            className={cn(
              "pop-card w-full max-w-xs rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-center backdrop-blur-md transition-all duration-500",
              ehrActive && "border-electric/40 shadow-glow",
            )}
          >
            <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-on-dark">
              <Monitor className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs font-semibold text-on-dark">Practice EHR</p>
            <p className="mt-1 text-[10px] text-on-dark-muted">Enter once</p>
          </div>

          <div className="relative h-8 w-px overflow-hidden bg-white/15">
            <span
              className={cn(
                "absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-aqua transition-all duration-700",
                phase >= 1 ? "top-full" : "top-0",
              )}
            />
          </div>

          <div
            className={cn(
              "pop-card w-full max-w-xs rounded-2xl border border-aqua/40 bg-white/[0.1] p-5 text-center backdrop-blur-md transition-all duration-500",
              hubActive && "shadow-glow",
            )}
          >
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl border border-aqua/30 bg-aqua/20 text-aqua">
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="mt-3 font-display text-lg font-bold text-aqua">OptiGo</p>
            <p className="mt-1 text-[10px] text-on-dark-muted">Routes & updates</p>
          </div>

          <div className="grid w-full max-w-xs grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="relative h-px overflow-hidden bg-white/15">
              <span
                className={cn(
                  "absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-aqua transition-all duration-700",
                  phase >= 3 ? "left-full" : "left-0",
                )}
              />
            </div>
            <ArrowDown className="h-4 w-4 text-on-dark-muted" />
            <div className="relative h-px overflow-hidden bg-white/15">
              <span
                className={cn(
                  "absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-aqua transition-all duration-700",
                  phase >= 2 ? "left-full" : "left-0",
                )}
              />
            </div>
          </div>

          <div className="grid w-full max-w-xs grid-cols-2 gap-3">
            <div
              className={cn(
                "pop-card rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-center backdrop-blur-md transition-all duration-500",
                labActive && "border-electric/40 shadow-glow",
              )}
            >
              <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-on-dark">
                <Glasses className="h-4 w-4" />
              </span>
              <p className="mt-2 text-[11px] font-semibold text-on-dark">Optical Lab</p>
            </div>

            <div
              className={cn(
                "pop-card rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-center backdrop-blur-md transition-all duration-500",
                patientActive && "border-electric/40 shadow-glow",
              )}
            >
              <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-on-dark">
                <Smartphone className="h-4 w-4" />
              </span>
              <p className="mt-2 text-[11px] font-semibold text-on-dark">Patient</p>
            </div>
          </div>

          <div className="w-full max-w-xs rounded-[1.5rem] border border-white/12 bg-background p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy">
                <Smartphone className="h-3 w-3 text-electric" /> OptiGo updates
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">live</span>
            </div>
            <div className="mt-3 space-y-2">
              {patientUpdates.map((u, i) => (
                <div
                  key={u.label}
                  className="flex items-start gap-2 rounded-xl border border-border bg-mist px-3 py-2"
                  style={{
                    opacity: visibleUpdates > i ? 1 : 0.5,
                    transform: visibleUpdates > i ? "none" : "translateY(4px)",
                    transition: "all 400ms cubic-bezier(.22,1,.36,1)",
                  }}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
                      visibleUpdates > i ? "bg-electric" : "bg-muted",
                    )}
                  >
                    <Check className="h-2 w-2 text-primary-foreground" />
                  </span>
                  <span className="text-[11px] leading-snug text-navy/85">{u.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- comparison ---------------- */

const before = [
  "Disconnected workflows",
  "Manual follow-up",
  "Limited visibility",
  "Patient status calls",
];

const after = [
  "Connected workflow",
  "Automated data movement",
  "Order visibility",
  "Proactive communication",
];

function Comparison() {
  return (
    <div className="story-3d">
      <div className="grid gap-5 sm:grid-cols-2">
        <Reveal className="pop-card rounded-3xl border border-border bg-background p-6 sm:p-8">
          <p className="eyebrow">Before</p>
          <ul className="mt-5 space-y-3">
            {before.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted">
                  <X className="h-2.5 w-2.5 text-muted-foreground" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={120}
          className="pop-card relative overflow-hidden rounded-3xl border border-electric/25 surface-dark p-6 sm:p-8"
        >
          <div className="absolute inset-0 grid-mesh-dark opacity-60" />
          <div className="relative">
            <p className="eyebrow text-aqua">OptiGo</p>
            <ul className="mt-5 space-y-3">
              {after.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm text-on-dark">
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-aqua">
                    <Check className="h-2.5 w-2.5 text-navy-deep" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={160} className="mt-8 text-center">
        <p className="mx-auto max-w-3xl text-2xl font-bold leading-snug text-navy sm:text-3xl">
          Less entering. Less checking. Less calling.{" "}
          <span className="text-gradient">More visibility.</span>
        </p>
        <div className="mt-6 flex justify-center">
          <CTAButton to="/how-it-works">See How OptiGo Works</CTAButton>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------------- exported section ---------------- */

export function WhyStory() {
  return (
    <>
      <section className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-22">
        <div className="absolute inset-0 grid-mesh opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Why OptiGo exists</p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.05] text-navy sm:text-4xl lg:text-[3.1rem]">
              A patient orders glasses.{" "}
              <span className="text-gradient">That should be the easy part.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              The exam is done. The patient has paid. But behind the counter, the real work is just
              beginning.
            </p>
          </Reveal>

          <div className="mt-12 space-y-12 sm:space-y-16">
            <Reveal>
              <StepLabel n="01">The re-entry</StepLabel>
              <div className="mt-5">
                <StepReentry />
              </div>
            </Reveal>

            <Reveal>
              <StepLabel n="02">The black box</StepLabel>
              <div className="mt-5">
                <StepBlackBox />
              </div>
            </Reveal>

            <Reveal>
              <StepLabel n="03">The interruption</StepLabel>
              <div className="mt-5">
                <StepCall />
              </div>
            </Reveal>

            <Reveal>
              <StepLabel n="04">The multiplier</StepLabel>
              <div className="mt-5">
                <StepMultiply />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <BetterWay />
        </div>
      </section>

      <section className="relative overflow-hidden bg-mist px-5 py-16 sm:px-8 sm:py-22">
        <div className="absolute inset-0 grid-mesh opacity-50" />
        <div className="relative mx-auto max-w-7xl space-y-12 sm:space-y-16">
          <Reveal>
            <OptigoFlow />
          </Reveal>
          <Comparison />
        </div>
      </section>
    </>
  );
}
