import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  GitBranch,
  Radar,
  BarChart3,
  Shuffle,
  MessageSquareOff,
  LineChart,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { HeroFlow } from "@/components/site/hero-flow";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { Section, SectionHeading, CTAButton, FeatureCard } from "@/components/site/primitives";
import { TrustSection } from "@/components/site/sections";
import { DemoForm, SignupForm, type SignupAccountType } from "@/components/site/forms";
import { LensesIcon } from "@/components/site/lenses-icon";
import { cn } from "@/lib/utils";

const TITLE = "OptiGo | Connect Every PMS to Every LMS";
const DESC =
  "OptiGo connects all Practice Management Systems (PMS) to all Lab Management Systems (LMS) in one place—then verifies and routes every order automatically.";

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
    body: "There's no one platform to communicate with labs or patients—progress lives in portals, calls, emails, and notes, so delays and answers get lost.",
  },
  {
    icon: <LineChart className="h-4 w-4" />,
    title: "No clear lab intelligence",
    body: "Spend, turnaround, remakes, and lab performance stay fragmented—so leaders can't compare or control cost.",
  },
];

const capabilities = [
  {
    icon: <GitBranch className="h-4 w-4" />,
    title: "Verify and route every order",
    body: "OptiGo checks the order, then routes it to the right Lab Management System based on your rules—pricing, turnaround, insurance, product fit, and preferences.",
  },
  {
    icon: <Radar className="h-4 w-4" />,
    title: "Track across PMS and LMS",
    body: "A single timeline from PMS submission through LMS production to patient pickup—status, owner, and next action in one view.",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Decide with connected data",
    body: "Spend, turnaround, remakes, and lab comparisons built from the verified PMS–LMS flow—not from spreadsheets and portals.",
  },
];

function Index() {
  const [accountType, setAccountType] = useState<SignupAccountType | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }
  }, []);

  return (
    <>
      {/* HERO */}
      <section id="top" className="relative overflow-hidden px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-14">
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
                  <span className="text-gradient">every optical lab order.</span>
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  One centralized platform for automated ordering, communication, tracking,
                  payments, and lab intelligence—without juggling portals, spreadsheets, emails,
                  or phone calls.
                </p>
              </Reveal>
              <Reveal delay={210} className="mt-9 flex flex-wrap gap-3">
                <CTAButton href="#get-started">Sign Up</CTAButton>
                <CTAButton href="#contact" variant="ghost">
                  Request a Demo
                </CTAButton>
              </Reveal>
            </div>

            <Reveal delay={160} className="relative">
              <div
                className="absolute inset-[4%_2%_8%] -z-10 bg-gradient-to-br from-electric/20 via-transparent to-aqua/25 blur-2xl"
                style={{
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  WebkitClipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
              <HeroFlow />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section id="problem" tone="mist">
        <SectionHeading
          eyebrow="The problem"
          title="Lab ordering is still fragmented."
          body="Practices work with many labs—each with its own portal, catalog, pricing, and status process. Staff stitch it together by hand."
          align="center"
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
      <Section id="solution">
        <SectionHeading
          eyebrow="The solution"
          title="OptiGo verifies and routes the order."
          body="Connect every PMS to every LMS in one place. OptiGo validates what comes in, then sends each order to the right lab management system—so staff stop re-checking and re-routing by hand."
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
      <Section id="product" tone="mist">
        <SectionHeading
          eyebrow="The product"
          title="Every PMS–LMS order, in one place."
          body="One operational surface across PMS and LMS—OptiGo verifies and routes orders, then keeps status, communication, and performance in sync."
        />
        <Reveal delay={120} className="mt-12">
          <DashboardMockup />
        </Reveal>
        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          Interactive demo — click Overview, Orders, LMS, Analytics, and more. All records are
          fictional.
        </p>
      </Section>

      {/* WHO */}
      <Section id="who">
        <SectionHeading
          eyebrow="Who it's for"
          title="Built for both sides of the connection."
          body="Practices on a PMS and labs on an LMS—finally linked through OptiGo."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="lift flex flex-col rounded-3xl border border-border bg-background p-8 sm:p-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-electric">
              <Building2 className="h-4 w-4" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight text-navy sm:text-3xl">
              Practices using a PMS
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Connect your Practice Management System once and reach every Lab Management
              System you work with—without re-keying or portal hopping.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-navy/85">
              {[
                "One hub from your PMS to many LMS",
                "Fewer re-entries and status calls",
                "Clear spend and turnaround insight",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <a
                href="#get-started"
                onClick={(e) => {
                  e.preventDefault();
                  setAccountType("practice");
                  window.history.pushState(null, "", "#get-started");
                  document.getElementById("get-started")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-electric"
              >
                Sign up as a practice
              </a>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="lift relative flex flex-col overflow-hidden rounded-3xl border border-electric/20 surface-dark p-8 sm:p-10"
          >
            <div className="absolute inset-0 grid-mesh-dark opacity-60" />
            <div className="relative flex flex-1 flex-col">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-aqua">
                <LensesIcon className="h-4 w-4" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight text-on-dark sm:text-3xl">
                Labs using an LMS
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-on-dark-muted">
                Connect your Lab Management System once and receive structured orders from
                practices on OptiGo—no one-off portal for every clinic.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-on-dark/90">
                {[
                  "Cleaner handoffs from any connected PMS",
                  "Fewer repetitive status inquiries",
                  "One LMS connection to many practices",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="#get-started"
                  onClick={(e) => {
                    e.preventDefault();
                    setAccountType("lab");
                    window.history.pushState(null, "", "#get-started");
                    document.getElementById("get-started")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-on-dark px-5 py-3 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-aqua"
                >
                  Sign up as a lab
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* GET STARTED / SIGNUP */}
      <Section id="get-started" tone="mist">
        <SectionHeading
          eyebrow="Sign up"
          title="Create your OptiGo account."
          body="Join as a practice (PMS) or lab (LMS). We’ll connect you into the OptiGo network."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => setAccountType("practice")}
            className={cn(
              "rounded-3xl border p-6 text-left transition-all sm:p-7",
              accountType === "practice"
                ? "border-electric bg-accent shadow-card"
                : "border-border bg-background hover:border-electric/40",
            )}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-electric">
              <Building2 className="h-4 w-4" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy">Practice (PMS)</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect your Practice Management System to every LMS you work with.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setAccountType("lab")}
            className={cn(
              "rounded-3xl border p-6 text-left transition-all sm:p-7",
              accountType === "lab"
                ? "border-electric/40 surface-dark shadow-glow"
                : "border-border bg-background hover:border-electric/40",
            )}
          >
            <span
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                accountType === "lab" ? "bg-white/10 text-aqua" : "bg-accent text-electric",
              )}
            >
              <LensesIcon className="h-4 w-4" />
            </span>
            <h3
              className={cn(
                "mt-4 text-lg font-bold",
                accountType === "lab" ? "text-on-dark" : "text-navy",
              )}
            >
              Lab (LMS)
            </h3>
            <p
              className={cn(
                "mt-2 text-sm",
                accountType === "lab" ? "text-on-dark-muted" : "text-muted-foreground",
              )}
            >
              Connect your Lab Management System to practices on OptiGo.
            </p>
          </button>
        </div>

        {accountType && (
          <Reveal className="mt-8 glass-panel rounded-3xl p-6 sm:p-9">
            <SignupForm
              accountType={accountType}
              onChangeType={() => setAccountType(null)}
            />
          </Reveal>
        )}
      </Section>

      {/* CONTACT / DEMO */}
      <Section id="contact">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Request a demo"
              title="Want a walkthrough first?"
              body="Tell us about your practice or lab and we’ll follow up to show you OptiGo."
            />
            <Reveal className="mt-8 rounded-3xl border border-border bg-background p-6 shadow-card sm:p-8">
              <DemoForm />
            </Reveal>
          </div>
          <Reveal delay={100} className="space-y-4 lg:pt-16">
            <div className="rounded-3xl border border-border bg-mist p-6">
              <p className="eyebrow">What to expect</p>
              <ul className="mt-4 space-y-3 text-sm text-navy/85">
                {[
                  "A short conversation about your current lab ordering workflow",
                  "A walkthrough of the OptiGo experience",
                  "Clear next steps for signup or partnership",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-electric/20 surface-dark p-6">
              <p className="eyebrow text-aqua">Prefer to jump in?</p>
              <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
                Skip the demo and create an account above — we’ll still follow up personally.
              </p>
              <div className="mt-5">
                <CTAButton href="#get-started" variant="light">
                  Go to sign up
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <TrustSection />
    </>
  );
}
