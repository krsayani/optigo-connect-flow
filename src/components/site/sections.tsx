import {
  Activity,
  Cable,
  Eye,
  Sparkles,
  ShieldCheck,
  KeyRound,
  ServerCog,
  Lock,
  FileCheck2,
  Building2,
  Cpu,
  HeartPulse,
} from "lucide-react";
import { Section, SectionHeading, CTAButton, FeatureCard } from "./primitives";
import { Reveal } from "./reveal";
import { InfrastructureGraphic } from "./infrastructure-graphic";
import { LensesIcon } from "@/components/site/lenses-icon";

/* ---------- Ecosystem strip ---------- */

const ecosystem = [
  { label: "Patient", icon: HeartPulse },
  { label: "Practice", icon: Building2 },
  { label: "PMS", icon: Cpu },
  { label: "LMS", icon: LensesIcon },
];

export function EcosystemStrip() {
  return (
    <section className="border-y border-border bg-mist px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold tracking-tight text-navy sm:text-base">
            Built for the optical ecosystem.
          </p>
        </Reveal>
        <Reveal
          delay={100}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {ecosystem.map((e) => (
            <div
              key={e.label}
              className="lift flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background px-4 py-4"
            >
              <e.icon className="h-4 w-4 text-electric" />
              <span className="text-[13px] font-semibold text-navy">{e.label}</span>
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
            body="Instead of forcing practices to operate across disconnected systems, OptiGo is building a connectivity layer designed to help information move where it needs to go."
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

/* ---------- Why OptiGo ---------- */

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

export function WhyOptiGo() {
  return (
    <Section tone="mist">
      <SectionHeading eyebrow="Why OptiGo" title="What a shared connectivity layer changes." />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {why.map((w, i) => (
          <Reveal key={w.title} delay={i * 80}>
            <FeatureCard
              icon={w.icon}
              title={w.title.toUpperCase()}
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
            body="OptiGo is starting by tackling one of the most fragmented workflows in optometry. But we're building the foundation for something much larger — a more connected, intelligent, and efficient future for the modern optometry practice."
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

/* ---------- Trust ---------- */

const trust = [
  { title: "Security-conscious architecture", icon: <ShieldCheck className="h-4 w-4" /> },
  { title: "Responsible data handling", icon: <FileCheck2 className="h-4 w-4" /> },
  { title: "Role-based access", icon: <KeyRound className="h-4 w-4" /> },
  { title: "Reliable infrastructure", icon: <ServerCog className="h-4 w-4" /> },
  { title: "Privacy-focused design", icon: <Lock className="h-4 w-4" /> },
];

export function TrustSection() {
  return (
    <Section tone="mist">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <SectionHeading
          eyebrow="Trust"
          title="Built with healthcare workflows in mind."
          body="Designed with security and privacy as foundational considerations."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {trust.map((t, i) => (
            <Reveal key={t.title} delay={i * 70}>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-electric">
                  {t.icon}
                </span>
                <span className="text-[13px] font-semibold text-navy">{t.title}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Final CTA ---------- */

export function FinalCTA() {
  return (
    <Section tone="dark">
      <div className="absolute inset-0 grid-mesh-dark opacity-60" />
      <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-aqua/15 blur-3xl animate-drift" />
      <div className="relative mx-auto max-w-3xl text-center">
        <SectionHeading
          align="center"
          tone="dark"
          title="Help build the future of optical connectivity."
          body="Whether you're an optometry practice, optical laboratory, practice management provider, or technology partner, we'd like to hear from you."
        />
        <Reveal delay={140} className="mt-10 flex flex-wrap justify-center gap-3">
          <CTAButton to="/signup" variant="light">
            Sign Up
          </CTAButton>
          <CTAButton to="/demo" variant="outline-light">
            Request a Demo
          </CTAButton>
        </Reveal>
      </div>
    </Section>
  );
}
