import { createFileRoute } from "@tanstack/react-router";
import { FinalBand, LfEyebrow, LfPageHero, LfSection } from "@/components/site/lf";
import { AdapterFlow } from "@/components/site/adapter-flow";
import { Reveal } from "@/components/site/reveal";

const TITLE = "Technology | LensFlow adapter and event layer";
const DESC =
  "A translation layer built for a fragmented industry. LensFlow assumes eyecare will never standardize on one Practice Management System or one LMS.";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/technology" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/technology" }],
  }),
  component: TechnologyPage,
});

const pieces = [
  {
    title: "Works alongside any practice system",
    body: "LensFlow's workflow lets practices on Eyefinity, Crystal PM, RevolutionEHR, Compulink and others use LensFlow now. Where an approved native integration exists, the exchange gets more automated — but it is never a prerequisite.",
  },
  {
    title: "The normalized job object",
    body: "Rx, lens design, material, coatings, measurements, frame, and insurance context collapse into one validated schema with hard rules at the edge.",
  },
  {
    title: "Native LMS delivery",
    body: "Jobs arrive inside the lab's own management system — including Ocuco LMS — so nothing depends on a lab tech opening yet another portal.",
  },
  {
    title: "Event stream, not polling",
    body: "Production milestones are pushed back as events. Practice, lab, and patient views are projections of the same append-only log.",
  },
  {
    title: "Exception ranking",
    body: "Late, stuck, and remade jobs surface to the top of the queue the day they happen instead of the week someone notices.",
  },
  {
    title: "Privacy by design",
    body: "Least-privilege access per location, encrypted in transit and at rest, and every event timestamped and attributable for audit.",
  },
];

const glance = [
  ["Practice systems", "Works alongside your existing Practice Management System"],
  ["Job schema", "One normalized optical order object"],
  ["Lab connectivity", "Ocuco connected; more expanding"],
  ["Status model", "Shared, event-sourced"],
  ["Patient comms", "Automatic milestone notifications"],
  ["Scope", "Multi-lab, multi-location"],
];

function TechnologyPage() {
  return (
    <>
      <LfPageHero
        eyebrow="Technology"
        title="A translation layer built for a fragmented industry."
        body="Eyecare will never standardize on one Practice Management System or one LMS. LensFlow assumes that permanently, so a practice never has to wait on its Practice Management System vendor to modernize its optical."
      />
      <LfSection>
        <AdapterFlow />
      </LfSection>
      <LfSection className="bg-secondary/40">
        <LfEyebrow>Inside the stack</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          Six pieces doing the quiet work.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {pieces.map((piece, i) => (
            <Reveal key={piece.title} delay={i * 50} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <h3 className="font-display text-xl font-semibold">{piece.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{piece.body}</p>
            </Reveal>
          ))}
        </div>
      </LfSection>
      <LfSection>
        <LfEyebrow>At a glance</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          The short technical answer.
        </h2>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          If you are evaluating LensFlow for a group, a lab, or a partnership, this is the shape of
          the system.
        </p>
        <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
          {glance.map(([k, v]) => (
            <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[14rem_1fr] sm:items-center">
              <p className="text-sm font-semibold">{k}</p>
              <p className="text-sm text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </LfSection>
      <FinalBand title="Talk to our team" primary={{ to: "/contact", label: "Request early access" }} />
    </>
  );
}
