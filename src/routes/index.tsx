import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  FlaskConical,
  GitBranch,
  Radar,
  BarChart3,
  Shuffle,
  MessageSquareOff,
  LineChart,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { HeroFlow } from "@/components/site/hero-flow";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { Section, SectionHeading, CTAButton, FeatureCard } from "@/components/site/primitives";
import {
  InfrastructureSection,
  BuiltForMore,
  TrustSection,
  FinalCTA,
} from "@/components/site/sections";

const TITLE = "OptiGo | Centralized Optical Lab Ordering";
const DESC =
  "OptiGo is the single source of truth for optical-lab orders—automating routing, tracking every stage, and turning order data into clear operational and financial insight.";

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

const problems = [
  {
    icon: <Shuffle className="h-4 w-4" />,
    title: "Manual, inconsistent ordering",
    body: "Staff pick labs and re-enter orders across portals—slow, error-prone, and hard to train.",
  },
  {
    icon: <MessageSquareOff className="h-4 w-4" />,
    title: "Scattered status updates",
    body: "Progress lives in portals, calls, emails, and notes—so delays and patient answers get lost.",
  },
  {
    icon: <LineChart className="h-4 w-4" />,
    title: "No clear lab intelligence",
    body: "Spend, turnaround, remakes, and lab performance stay fragmented—so leaders can’t compare or control cost.",
  },
];

const capabilities = [
  {
    icon: <GitBranch className="h-4 w-4" />,
    title: "Automated real-time routing",
    body: "Connect every lab in one place. OptiGo recommends or routes by pricing, turnaround, insurance, product fit, and your rules—with logged overrides.",
  },
  {
    icon: <Radar className="h-4 w-4" />,
    title: "End-to-end tracking",
    body: "One timeline from submission to patient pickup—status, owner, latest message, and next action in a single view.",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Decision-support metrics",
    body: "See spend, cost per order, turnaround, remakes, lab comparisons, and routing savings—filterable by location, lab, product, and more.",
  },
];

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
                <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-navy sm:text-5xl lg:text-[3.85rem]">
                  One platform for
                  <br />
                  <span className="text-gradient">every lab order.</span>
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Centralized ordering, tracking, and lab intelligence for eye-care practices—
                  without juggling portals, spreadsheets, or phone calls.
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

      {/* PROBLEM */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="The problem"
          title="Lab ordering is still fragmented."
          body="Practices work with many labs—each with its own portal, catalog, pricing, and status process. Staff stitch it together by hand."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {problems.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <FeatureCard
                icon={item.icon}
                title={item.title}
                body={item.body}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* SOLUTION */}
      <Section>
        <SectionHeading
          eyebrow="The solution"
          title="Submit. Route. Track. Decide—in one system."
          body="OptiGo is the single source of truth for optical-lab orders: less manual work, clearer patient updates, faster turnaround, and better cost control."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {capabilities.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="lift relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background p-7 sm:p-8">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-electric">
                  {item.icon}
                </span>
                <p className="mt-5 font-mono text-[11px] tracking-[0.18em] text-electric">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* PRODUCT */}
      <Section tone="mist">
        <SectionHeading
          eyebrow="The product"
          title="Every optical order, in one place."
          body="One operational surface for routing, status, communication, and performance across locations and labs."
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
              Built for eye-care practices.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Route smarter, see every order end to end, and give leaders the lab cost and
              performance data they need—across every location.
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
                Built for optical labs.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-on-dark-muted">
                Receive structured orders, share status once, and stay connected to practices
                without one-off portal chaos.
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
          title="Works with the systems you already use."
          body="Practice-management, EHR, and laboratory connections are in active development."
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
