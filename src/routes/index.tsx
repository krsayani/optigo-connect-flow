import { createFileRoute } from "@tanstack/react-router";
import { LfButton, LfEyebrow, LfSection, Marquee, FinalBand, CheckList } from "@/components/site/lf";
import { MeetTheFounders } from "@/components/site/meet-the-founders";
import { OrderStatusCard } from "@/components/site/order-status-card";
import { EcosystemHub } from "@/components/site/adapter-flow";
import { Reveal } from "@/components/site/reveal";

const TITLE = "LensFlow — The optical platform that works with your practice";
const DESC =
  "Order creation, lab communication, tracking, payments, patient updates and analytics — connected in one platform, whatever Practice Management System your practice already runs.";

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

const afterSale = [
  {
    title: "Create the order",
    body: "Built in LensFlow the moment the patient buys, with the optical detail the lab actually needs.",
  },
  {
    title: "Validate it",
    body: "Rules catch missing measurements and impossible lens combinations before the job leaves the practice.",
  },
  {
    title: "Send it to the lab",
    body: "Routed to a participating optical laboratory as a structured job, not a fax or a PDF.",
  },
  {
    title: "Communicate and track",
    body: "One shared status and one thread with the lab — no portal logins, no chasing calls.",
  },
  {
    title: "Update the patient",
    body: "Automatic milestone messages, so the front desk stops fielding 'is it ready yet' calls.",
  },
  {
    title: "Handle payments",
    body: "Capture what is owed and reconcile the optical side of the sale in the same place.",
  },
  {
    title: "Capture the data",
    body: "Turnaround, remakes, lab performance and revenue mix — measured instead of guessed.",
  },
];

function Index() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="soft-wash absolute -inset-x-[20%] -top-[30%] h-[160%] opacity-90" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 55%, var(--background) 100%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="lf-reveal" style={{ animationDelay: "60ms" }}>
            <h1 className="mx-auto max-w-4xl text-[2.7rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem]">
              The <span className="holo-text">optical platform</span> that works with your practice.
            </h1>
          </div>
          <div className="lf-reveal" style={{ animationDelay: "130ms" }}>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {DESC}
            </p>
          </div>
          <div className="lf-reveal" style={{ animationDelay: "200ms" }}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <LfButton to="/contact">Request early access</LfButton>
              <LfButton to="/for-labs" variant="ghost">
                For optical labs
              </LfButton>
            </div>
          </div>
        </div>
        <div className="lf-reveal relative mx-auto mt-16 max-w-6xl" style={{ animationDelay: "280ms" }}>
          <OrderStatusCard />
        </div>
      </section>

      <Marquee
        items={[
          "Works alongside any Practice Management System",
          "Structured lab orders",
          "Ocuco lab connectivity",
          "Live order tracking",
          "Automatic patient updates",
          "No migration required",
        ]}
      />

      <LfSection>
        <LfEyebrow>Works alongside your system</LfEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.08] sm:text-5xl">
          Keep your Practice Management System. Upgrade your optical workflow.
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          LensFlow works alongside the systems your practice already uses, giving your optical team
          a modern ordering, lab communication, tracking, patient communication, payment and
          analytics platform without requiring you to replace your Practice Management System.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9">
            <h3 className="font-display text-xl font-semibold">Your Practice Management System doesn't have to change</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Whether your practice uses Eyefinity, Crystal PM, RevolutionEHR, Compulink or another
              platform, LensFlow is designed to fit into your existing workflow.
            </p>
            <CheckList
              items={[
                "Fits your current workflow",
                "No forced system change",
                "Works with any practice platform",
              ]}
            />
          </Reveal>
          <Reveal delay={80} className="rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-9">
            <h3 className="font-display text-xl font-semibold">Two things, said precisely</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Works alongside.</span> Our
              workflow lets a practice use LensFlow regardless of its Practice Management System.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Native integration.</span> A system
              exchanges data directly with LensFlow through an approved technical connection. We only
              use that phrase where the connection actually exists.
            </p>
          </Reveal>
        </div>
      </LfSection>

      <LfSection className="bg-secondary/40">
        <LfEyebrow>One platform</LfEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.08] sm:text-5xl">
          One optical platform. Whatever Practice Management System you use.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          LensFlow sits between the practice workflow and the optical ecosystem, rather than being
          tied to one Practice Management System.
        </p>
        <div className="mt-12">
          <EcosystemHub />
        </div>
        <div className="mt-8">
          <LfButton to="/technology" variant="ghost">
            How the technology works
          </LfButton>
        </div>
      </LfSection>

      <LfSection>
        <LfEyebrow>The story</LfEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.08] sm:text-5xl">
          LensFlow meets your practice where it is.
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Your practice shouldn't have to change its Practice Management System just to modernize its optical. LensFlow's
          workflow is designed to work across different practice environments, so
          optical teams can begin using LensFlow regardless of which Practice Management System they run.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-border bg-card p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Traditional approach
            </p>
            <ol className="mt-5 space-y-4">
              {[
                "Practice chooses a Practice Management System",
                "Practice is limited by what that Practice Management System integrates with",
                "Practice waits for vendors to build integrations",
                "Optical workflow stays fragmented",
              ].map((item, i) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="font-mono text-muted-foreground">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={80} className="rounded-3xl border border-signal/30 bg-foreground p-7 text-background">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-soft">
              The LensFlow approach
            </p>
            <ol className="mt-5 space-y-4">
              {[
                "Your existing Practice Management System — Eyefinity, Crystal, RevolutionEHR, Compulink or other",
                "LensFlow",
                "Participating optical lab",
                "Tracking, communication, payments, analytics",
                "Patient",
              ].map((item, i) => (
                <li key={item} className="flex gap-3 text-sm text-background/90">
                  <span className="font-mono text-signal-soft">0{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </LfSection>

      <LfSection className="bg-secondary/40">
        <LfEyebrow>After the sale</LfEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.08] sm:text-5xl">
          Don't change your Practice Management System. Change what happens after the sale.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          The patient buys their glasses. From that moment, LensFlow takes over the optical workflow.
        </p>
        <div className="mt-12 grid gap-4">
          {afterSale.map((step, i) => (
            <Reveal key={step.title} delay={i * 40} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={280} className="rounded-3xl bg-foreground p-7 text-background sm:p-9">
            <h3 className="font-display text-2xl font-semibold">Understand the business</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/75">
              The result: a practice that finally sees its optical operation clearly — and a patient
              who is never left wondering.
            </p>
          </Reveal>
        </div>
      </LfSection>

      <LfSection>
        <LfEyebrow>Connectivity</LfEyebrow>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.08] sm:text-5xl">
          Built to connect with the optical ecosystem.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Two different kinds of connection — and we are careful about which is which.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-border bg-card p-7 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Practice systems
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold">
              LensFlow works alongside your existing practice system.
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Eyefinity", "Crystal PM", "RevolutionEHR", "Compulink", "More"].map((name) => (
                <span key={name} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
                  {name}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              These are environments LensFlow is designed to operate alongside. Practices do not need
              to wait for their Practice Management System provider to approve a specific integration before they can
              benefit from LensFlow.
            </p>
          </Reveal>
          <Reveal delay={80} className="rounded-3xl border border-signal/30 bg-foreground p-7 text-background sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-soft">
              Lab connectivity
            </p>
            <p className="mt-5 font-display text-3xl font-semibold">Ocuco</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-background/50">
              lab management connectivity
            </p>
            <span className="mt-4 inline-flex rounded-full border border-signal/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-signal-soft">
              Connected
            </span>
            <p className="mt-5 text-sm leading-relaxed text-background/75">
              LensFlow's connectivity with Ocuco helps create a digital bridge between participating
              optical laboratories and practices using LensFlow.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-background/45">
              Additional laboratory connections expanding
            </p>
            <div className="mt-6">
              <LfButton to="/for-labs" variant="ghost" className="border-white/15 bg-white/5 text-background hover:border-signal/50">
                Become a LensFlow lab partner
              </LfButton>
            </div>
          </Reveal>
        </div>
      </LfSection>

      <MeetTheFounders />

      <FinalBand
        eyebrow="Now onboarding"
        title="Use LensFlow today. Get even more automation tomorrow."
        body="Twenty minutes is enough to see the whole loop: create an order, watch it reach the lab, and watch the patient get updated."
        primary={{ to: "/contact", label: "Request early access" }}
        secondary={{ to: "/for-labs", label: "For optical labs" }}
      />
    </>
  );
}
