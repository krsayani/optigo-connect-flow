import { createFileRoute } from "@tanstack/react-router";
import { FinalBand, LfEyebrow, LfPageHero, LfSection } from "@/components/site/lf";
import { MeetTheFounders } from "@/components/site/meet-the-founders";
import { Reveal } from "@/components/site/reveal";

const TITLE = "About us | LensFlow";
const DESC =
  "We are building the plumbing eyecare should have had a decade ago — one shared optical order between the systems that already exist.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/about" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const principles = [
  {
    title: "Meet the industry where it is",
    body: "Nobody is switching EHRs or lab systems because a startup asked. We build adapters instead of ultimatums.",
  },
  {
    title: "One record, not four opinions",
    body: "Every dispute in optical ordering starts with two systems disagreeing. We collapse them into a single shared order.",
  },
  {
    title: "Both sides have to win",
    body: "A network only compounds when practices and labs each get more than they give. We design every feature against that test.",
  },
  {
    title: "Privacy is not a feature",
    body: "Least-privilege access, encryption in transit and at rest, and a complete audit trail are table stakes, not upsells.",
  },
];

const timeline = [
  ["01 · Started", "Built after watching the same Rx get typed three times in one afternoon."],
  ["02 · Partnered", "Integration partnership with Ocuco LMS to deliver jobs natively into labs."],
  ["03 · Live", "Multiple labs and practices onboarded and routing real orders."],
  ["04 · Next", "Deeper EHR coverage and richer patient-facing tracking across the network."],
];

function AboutPage() {
  return (
    <>
      <LfPageHero
        eyebrow="About us"
        title="We are building the plumbing eyecare should have had a decade ago."
        body="LensFlow is a small, deliberately focused software team. We do one thing: make an optical order travel cleanly between the systems that already exist."
      />
      <LfSection>
        <LfEyebrow>Principles</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          How we make decisions.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {principles.map((item, i) => (
            <Reveal key={item.title} delay={i * 50} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </LfSection>
      <LfSection className="bg-secondary/40">
        <LfEyebrow>Where we are</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          Early, but already live.
        </h2>
        <div className="mt-12 grid gap-4">
          {timeline.map(([k, v], i) => (
            <Reveal key={k} delay={i * 40} className="rounded-3xl border border-border bg-card p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal">{k}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v}</p>
            </Reveal>
          ))}
        </div>
      </LfSection>
      <MeetTheFounders compact />
      <FinalBand title="Get in touch" primary={{ to: "/contact", label: "Request early access" }} />
    </>
  );
}
