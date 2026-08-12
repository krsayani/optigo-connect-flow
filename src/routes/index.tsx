import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, FlaskConical } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { HeroFlow } from "@/components/site/hero-flow";
import { WhyStory } from "@/components/site/why-story";
import { HowItWorksStages } from "@/components/site/how-it-works-stages";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { Section, SectionHeading, CTAButton } from "@/components/site/primitives";
import {
  InfrastructureSection,
  BuiltForMore,
  TrustSection,
  FinalCTA,
} from "@/components/site/sections";

const TITLE = "OptiGo | The Connected Future of Optical Ordering";
const DESC =
  "OptiGo is building modern infrastructure connecting optometry practices, EHR systems, optical laboratories, and patients through streamlined optical workflows.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14">
        <div className="absolute inset-0 surface-aurora" />
        <div className="absolute inset-0 grid-mesh opacity-45" />
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-electric/25 blur-3xl animate-orb" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-aqua/20 blur-3xl animate-orb" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:gap-10">
            <div>
              <Reveal>
                <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-electric">
                  OptiGo
                </p>
              </Reveal>
              <Reveal delay={70}>
                <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-navy sm:text-5xl lg:text-[4.15rem]">
                  Optical Ordering.
                  <br />
                  <span className="text-gradient">Reimagined.</span>
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  One intelligent workflow connecting practices, EHRs, labs, and patients —
                  so optical orders move with less chase and more clarity.
                </p>
              </Reveal>
              <Reveal delay={210} className="mt-9 flex flex-wrap gap-3">
                <CTAButton to="/signup">Sign Up</CTAButton>
                <CTAButton to="/demo" variant="ghost">
                  Request a Demo
                </CTAButton>
              </Reveal>
            </div>

            <Reveal delay={160} className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-electric/15 via-transparent to-aqua/20 blur-2xl" />
              <HeroFlow />
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY OPTIGO EXISTS — storytelling */}
      <WhyStory />

      {/* HOW IT WORKS */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="How OptiGo works"
          title="Four stages, one continuous handoff."
          body="Connect, route, track, communicate — the four stages that turn a single submission into a tracked order everyone can see."
        />
        <HowItWorksStages />
      </Section>

      {/* PRODUCT */}
      <Section>
        <SectionHeading
          eyebrow="The product"
          title="Every optical order, in one place."
          body="A single operational surface for optical orders across locations and connected laboratories."
        />
        <Reveal delay={120} className="mt-12">
          <DashboardMockup />
        </Reveal>
        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          Product interface shown for illustration. All patient names and orders are fictional
          demo data.
        </p>
      </Section>

      {/* AUDIENCE SPLIT */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="lift flex flex-col rounded-3xl border border-border bg-background p-8 sm:p-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-electric">
              <Building2 className="h-4 w-4" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight text-navy sm:text-3xl">
              Less chasing.
              <br />
              More patient care.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Centralize optical orders, cut repetitive data entry, and give staff a clear view
              of every order without another phone call.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton to="/signup" search={{ type: "practice" }}>
                Sign up as a practice
              </CTAButton>
              <CTAButton to="/for-practices" variant="ghost">
                Learn more
              </CTAButton>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="lift relative flex flex-col overflow-hidden rounded-3xl border border-electric/20 surface-dark p-8 sm:p-10"
          >
            <div className="absolute inset-0 grid-mesh-dark opacity-60" />
            <div className="relative flex flex-1 flex-col">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-aqua">
                <FlaskConical className="h-4 w-4" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight text-on-dark sm:text-3xl">
                A better connection between labs and practices.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-on-dark-muted">
                Connect once and receive structured orders from every practice on OptiGo —
                no re-keying, no per-practice integration to maintain.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton to="/signup" search={{ type: "lab" }} variant="light">
                  Sign up as a lab
                </CTAButton>
                <CTAButton to="/for-labs" variant="outline-light">
                  Learn more
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* INTEGRATIONS TEASER */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="Integrations"
          title="Building the connected optical ecosystem."
          body="Integrations with the practice-management, EHR, and laboratory systems the industry already runs on are in active development."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {["Crystal Practice Management", "DVI", "Ocuco"].map((name, i) => (
            <Reveal key={name} delay={i * 90}>
              <div className="lift h-full rounded-2xl border border-border bg-background p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electric/15 to-aqua/20 font-display text-sm font-bold text-navy">
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="mt-5 text-base font-semibold text-navy">{name}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-electric/25 bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-electric">
                  Integration in development
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-8 flex flex-wrap items-center gap-3">
          <CTAButton to="/integrations" variant="ghost">
            View all integrations
          </CTAButton>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Interested in integrating with OptiGo?
            <ArrowRight className="h-3 w-3" />
          </span>
        </Reveal>
      </Section>

      <InfrastructureSection />
      <BuiltForMore />
      <TrustSection />
      <FinalCTA />
    </>
  );
}
