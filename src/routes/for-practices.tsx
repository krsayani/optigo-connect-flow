import { createFileRoute } from "@tanstack/react-router";
import { CheckList, FinalBand, LfButton, LfEyebrow, LfPageHero, LfSection } from "@/components/site/lf";
import { OrderStatusCard } from "@/components/site/order-status-card";
import { Reveal } from "@/components/site/reveal";

const TITLE = "For practices | LensFlow";
const DESC =
  "Your team ordered it once. That should be enough. LensFlow works alongside the practice system you already run.";

export const Route = createFileRoute("/for-practices")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/for-practices" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/for-practices" }],
  }),
  component: ForPracticesPage,
});

const reasons = [
  {
    title: "Give the front desk its day back",
    body: "Every order is entered once. Nobody retypes an Rx into a lab portal, and nobody calls the lab to ask where a job is.",
    items: ["No duplicate entry", "No portal logins", "No status phone tag"],
  },
  {
    title: "One queue, every lab",
    body: "Whether a job went to your in-house lab or three outside labs, it shows up in the same list with the same status language.",
    items: ["Multi-lab view", "Per-location access", "Exceptions ranked first"],
  },
  {
    title: "Patients who stop worrying",
    body: "Automatic milestone updates mean the patient hears from you before they think to call — and they show up when the job is actually ready.",
    items: ["Submitted → ready alerts", "Fewer no-shows", "Fewer angry calls"],
  },
  {
    title: "Keep your Practice Management System",
    body: "LensFlow's workflow runs alongside Eyefinity, Crystal PM, RevolutionEHR, Compulink and other practice systems, so there is no migration project and no waiting on a vendor integration.",
    items: ["Fits your current workflow", "No forced system change"],
  },
];

function ForPracticesPage() {
  return (
    <>
      <LfPageHero
        eyebrow="For practices"
        title="Your team ordered it once. That should be enough."
        body="LensFlow works alongside the practice system you already run and takes the coordination work off your staff — ordering, lab communication, tracking, payments, patient updates and analytics."
        actions={<LfButton to="/contact">Book a practice demo</LfButton>}
      />
      <LfSection>
        <OrderStatusCard />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["~2 min saved", "per order on entry alone"],
            ["Fewer calls", "status questions handled automatically"],
            ["Faster remakes", "problems caught the day they happen"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-lg font-semibold">{k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </LfSection>
      <LfSection className="bg-secondary/40">
        <LfEyebrow>Why practices pay for it</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          It removes work, not just clicks.
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {reasons.map((reason, i) => (
            <Reveal key={reason.title} delay={i * 50} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <h3 className="font-display text-xl font-semibold">{reason.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{reason.body}</p>
              <CheckList items={reason.items} />
            </Reveal>
          ))}
        </div>
      </LfSection>
      <FinalBand
        title="Use LensFlow on your terms"
        primary={{ to: "/contact", label: "Book a practice demo" }}
      />
    </>
  );
}
