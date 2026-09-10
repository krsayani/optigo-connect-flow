import { createFileRoute } from "@tanstack/react-router";
import { CheckList, FinalBand, LfEyebrow, LfPageHero, LfSection } from "@/components/site/lf";
import { AdapterFlow } from "@/components/site/adapter-flow";
import { Reveal } from "@/components/site/reveal";

const TITLE = "For labs | LensFlow";
const DESC =
  "Integrate once. Receive from the whole network. LensFlow delivers clean, structured jobs into the system you already run.";

export const Route = createFileRoute("/for-labs")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/for-labs" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/for-labs" }],
  }),
  component: ForLabsPage,
});

const reasons = [
  {
    title: "Clean jobs at intake",
    body: "Orders arrive validated against your requirements, so your team stops calling practices to fix a missing measurement or an ambiguous lens design.",
    items: ["Validated at the edge", "Fewer clarification calls", "Fewer remakes"],
  },
  {
    title: "Inside your LMS, not a portal",
    body: "We deliver natively into lab management systems, including Ocuco LMS. Your techs keep the workflow they already know.",
    items: ["Native delivery", "No new screens", "No re-entry"],
  },
  {
    title: "New order volume",
    body: "Every practice that joins the network can route to you without a bespoke project. Distribution is the point of a network.",
    items: ["One integration, many practices", "Faster practice onboarding", "Growth without sales overhead"],
  },
  {
    title: "Disputes end with a record",
    body: "Every event is timestamped and attributable, so a disagreement about when a job was submitted or shipped is settled in seconds.",
    items: ["Append-only event log", "Shared status language", "Audit-ready"],
  },
];

function ForLabsPage() {
  return (
    <>
      <LfPageHero
        eyebrow="For labs"
        title="Integrate once. Receive from the whole network."
        body="LensFlow is not another portal asking your techs to change how they work. It is a single pipe that delivers clean, structured jobs into the system you already run."
      />
      <LfSection>
        <AdapterFlow />
      </LfSection>
      <LfSection className="bg-secondary/40">
        <LfEyebrow>Why labs join</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          Four reasons it is worth the pipe.
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
      <FinalBand title="Join the network" primary={{ to: "/contact", label: "Request early access" }} />
    </>
  );
}
