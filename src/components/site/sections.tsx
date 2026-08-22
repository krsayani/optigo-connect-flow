import {
  Activity,
  Cable,
  Eye,
  Sparkles,
  Building2,
  Glasses,
} from "lucide-react";
import { Section, SectionHeading, CTAButton, FeatureCard } from "./primitives";
import { Reveal } from "./reveal";
import { InfrastructureGraphic } from "./infrastructure-graphic";
import { LensesIcon } from "@/components/site/lenses-icon";

/* ---------- Ecosystem strip ---------- */

const ecosystem = [
  { label: "Patient", icon: Glasses },
  { label: "Practice", icon: Building2 },
  { label: "Lab", icon: LensesIcon },
];

export function EcosystemStrip() {
  return (
    <section className="relative border-y border-border bg-mist px-5 py-12 sm:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-tight text-navy sm:text-base">
            Built for the optical ecosystem.
          </p>
        </Reveal>
        <Reveal delay={100} className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {ecosystem.map((e, i) => (
            <div key={e.label} className="flex items-center gap-3 sm:gap-4">
              <div className="lift flex items-center gap-2.5 rounded-2xl border border-border bg-background px-4 py-3.5 shadow-card">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-electric">
                  <e.icon className="h-4 w-4" />
                </span>
                <span className="text-[13px] font-semibold text-navy">{e.label}</span>
              </div>
              {i < ecosystem.length - 1 ? (
                <span
                  className="hidden h-px w-10 bg-gradient-to-r from-electric to-aqua sm:block"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Infrastructure (dark) ---------- */

export function InfrastructureSection() {
  return (
    <Section tone="dark">
      <div className="absolute inset-0 grid-mesh-dark opacity-60" />
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-electric/20 blur-3xl animate-drift" />
      <div className="relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading
            tone="dark"
            eyebrow="Infrastructure"
            title="The infrastructure connecting optical care."
            body="Instead of forcing practices to operate across disconnected systems, LensFlow is building a connectivity layer designed to help information move where it needs to go."
          />
          <Reveal delay={140} className="mt-9 flex flex-wrap gap-3">
            <CTAButton to="/platform" variant="light">
              Explore the platform
            </CTAButton>
            <CTAButton to="/partner" variant="outline-light">
              Partner With Us
            </CTAButton>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <InfrastructureGraphic />
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Why LensFlow ---------- */

const why = [
  {
    title: "Automation",
    body: "Reduce unnecessary manual workflow.",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    title: "Connectivity",
    body: "Bring practice and laboratory systems together.",
    icon: <Cable className="h-4 w-4" />,
  },
  {
    title: "Visibility",
    body: "Understand where orders stand.",
    icon: <Eye className="h-4 w-4" />,
  },
  {
    title: "Experience",
    body: "Create a better experience for staff and patients.",
    icon: <Activity className="h-4 w-4" />,
  },
];

export function WhyLensFlow() {
  return (
    <Section tone="mist">
      <SectionHeading
        align="center"
        eyebrow="Why LensFlow"
        title="What a shared connectivity layer changes."
        body="Four shifts that happen when practices and labs share one place to order, communicate, and track."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {why.map((w, i) => (
          <Reveal key={w.title} delay={i * 80}>
            <FeatureCard
              icon={w.icon}
              title={w.title}
              body={w.body}
              className="h-full"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Built for more ---------- */

export function BuiltForMore() {
  return (
    <Section>
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <SectionHeading
            eyebrow="Built for what's next"
            title="Today's workflow is only the beginning."
            body="LensFlow is starting by tackling one of the most fragmented workflows in optometry. But we're building the foundation for something much larger — a more connected, intelligent, and efficient future for the modern optometry practice."
          />
          <Reveal delay={140}>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-electric">
              Starting with optical. Building for the future of optometry.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120} className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-3xl">
            <div className="absolute inset-0 rounded-3xl border border-border bg-mist" />
            <div className="absolute inset-0 grid-mesh rounded-3xl opacity-70" />
            <div className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-3xl" />

            {/* connective rays */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {[20, 65, 110, 200, 245, 290].map((a, i) => {
                const rad = (a * Math.PI) / 180;
                const r = i === 1 || i === 4 ? 44 : 35;
                return (
                  <g key={a}>
                    <line
                      x1="50"
                      y1="50"
                      x2={50 + Math.cos(rad) * r}
                      y2={50 + Math.sin(rad) * r}
                      stroke="oklch(0.58 0.19 258 / 0.18)"
                      strokeWidth="0.4"
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2={50 + Math.cos(rad) * r}
                      y2={50 + Math.sin(rad) * r}
                      stroke="oklch(0.78 0.11 195)"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeDasharray="2 26"
                      vectorEffect="non-scaling-stroke"
                      style={{ animation: `dash-move ${2.6 + i * 0.3}s linear infinite` }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-electric/30 bg-navy shadow-glow">
                <span className="font-display text-sm font-extrabold text-on-dark">
                  Optical
                </span>
              </div>
            </div>
            {/* abstract, unlabeled future surfaces */}
            {[
              { r: 35, a: 20, s: 46, b: 0 },
              { r: 35, a: 110, s: 40, b: 1 },
              { r: 35, a: 200, s: 52, b: 0 },
              { r: 35, a: 290, s: 38, b: 1 },
              { r: 44, a: 65, s: 30, b: 2 },
              { r: 44, a: 245, s: 32, b: 2 },
            ].map((n, i) => {
              const rad = (n.a * Math.PI) / 180;
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-electric/25 bg-background/80 shadow-card"
                  style={{
                    left: `${50 + Math.cos(rad) * n.r}%`,
                    top: `${50 + Math.sin(rad) * n.r}%`,
                    width: n.s,
                    height: n.s,
                    filter: n.b ? `blur(${n.b}px)` : undefined,
                    animation: `pulse-soft ${4 + i * 0.6}s ease-in-out infinite`,
                  }}
                />
              );
            })}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Built for what's next
            </div>
          </div>

        </Reveal>
      </div>
    </Section>
  );
}
