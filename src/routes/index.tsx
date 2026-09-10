import { useEffect } from "react";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { HeroFlow } from "@/components/site/hero-flow";
import { WhyStory } from "@/components/site/why-story";
import { HowItWorksStages } from "@/components/site/how-it-works-stages";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { OrderTracker } from "@/components/site/order-tracker";
import { Section, SectionHeading, CTAButton } from "@/components/site/primitives";
import { LensesIcon } from "@/components/site/lenses-icon";
import {
  EcosystemStrip,
  InfrastructureSection,
  WhyLensFlow,
  BuiltForMore,
  TrustSection,
  FinalCTA,
} from "@/components/site/sections";

const TITLE = "LensFlow | The Connected Future of Optical Ordering";
const DESC =
  "LensFlow is building modern infrastructure connecting optometry practices, EHR systems, optical laboratories, and patients through streamlined optical workflows.";

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
  const hash = useLocation({ select: (l) => l.hash });

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }, [hash]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="absolute inset-0 surface-hero" />
        <div className="absolute inset-0 grid-mesh opacity-50" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_1.15fr] lg:gap-12">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-[11px] font-semibold text-navy backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-soft" />
                  Software infrastructure for optometry
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-4xl font-bold leading-[1.03] text-navy sm:text-5xl lg:text-[4rem]">
                  Optical Ordering.
                  <br />
                  <span className="text-gradient">Reimagined.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  LensFlow connects practices, EHR systems, optical laboratories, and patients
                  through one intelligent workflow—reducing manual work and bringing visibility
                  to every order.
                </p>
              </Reveal>
              <Reveal delay={240} className="mt-9 flex flex-wrap gap-3">
                <CTAButton to="/demo">Request a Demo</CTAButton>
                <CTAButton to="/partner" variant="ghost">
                  Become an Integration Partner
                </CTAButton>
              </Reveal>
            </div>

            <Reveal delay={180}>
              <HeroFlow />
            </Reveal>
          </div>
        </div>
      </section>

      <EcosystemStrip />

      {/* WHY OPTIGO EXISTS — storytelling */}
      <WhyStory />


      {/* HOW IT WORKS */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="How LensFlow works"
          title="How the connection works."
          body="Order information moves from the practice or EHR into LensFlow, through the appropriate laboratory workflow, and back as the order progresses."
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

      {/* VISIBILITY */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="Real-time visibility"
          title="Know where every order stands."
          body="LensFlow is being designed to give practices better visibility into the optical order lifecycle from submission through completion."
        />
        <OrderTracker />
      </Section>

      {/* WHO */}
      <Section id="who">
        <SectionHeading
          eyebrow="Who it's for"
          title="Built for both sides of the connection."
          body="Practices and labs—finally linked through LensFlow."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="lift flex h-full flex-col rounded-3xl border border-border bg-background p-8 sm:p-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-electric">
              <Building2 className="h-4 w-4" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight text-navy sm:text-3xl">
              Practices
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Connect your practice once and reach every lab you work with—ordering,
              communication, and payments in one place.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-navy/85">
              {[
                "One hub from your practice to many labs",
                "Quotes patients can purchase after they leave the office",
                "One place to communicate with labs and patients",
                "Payments, spend, and turnaround in one view",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <Link
                to="/signup"
                search={{ type: "practice" }}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-electric"
              >
                Sign up as a practice
              </Link>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="lift relative flex h-full flex-col overflow-hidden rounded-3xl border border-electric/20 surface-dark p-8 sm:p-10"
          >
            <div className="absolute inset-0 grid-mesh-dark opacity-60" />
            <div className="relative flex flex-1 flex-col">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-aqua">
                <LensesIcon className="h-4 w-4" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight text-on-dark sm:text-3xl">
                Labs
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-on-dark-muted">
                Connect your lab once and receive structured orders from practices on
                LensFlow—then talk, track, and settle in one thread.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-on-dark/90">
                {[
                  "Cleaner handoffs from any connected practice",
                  "One thread instead of repetitive status calls",
                  "One lab connection to many practices",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  to="/signup"
                  search={{ type: "lab" }}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-on-dark px-5 py-3 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-aqua"
                >
                  Sign up as a lab
                </Link>
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
          body="We're actively working with industry partners to connect LensFlow with the systems practices and laboratories already use."
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
            Interested in integrating with LensFlow?
            <ArrowRight className="h-3 w-3" />
          </span>
        </Reveal>
      </Section>

      <InfrastructureSection />
      <WhyLensFlow />
      <BuiltForMore />
      <TrustSection />
      <FinalCTA />
    </>
  );
}
