import { createFileRoute } from "@tanstack/react-router";
import { FinalBand, LfEyebrow, LfPageHero, LfSection } from "@/components/site/lf";
import { OrderStatusCard } from "@/components/site/order-status-card";
import { Reveal } from "@/components/site/reveal";

const TITLE = "What we do | LensFlow";
const DESC =
  "LensFlow sits between practice systems and optical labs as a translation and tracking layer — fast, quiet, and obvious to use on both ends.";

export const Route = createFileRoute("/what-we-do")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/what-we-do" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/what-we-do" }],
  }),
  component: WhatWeDoPage,
});

const steps = [
  {
    n: "01",
    title: "Submit",
    body: "The optician finishes the order where they already work — inside the Practice Management System. Nothing new to learn, no portal login.",
  },
  {
    n: "02",
    title: "Translate",
    body: "Our adapter layer normalizes Rx, lens design, measurements, frame and insurance context into one clean, validated job.",
  },
  {
    n: "03",
    title: "Route",
    body: "The job lands directly in the right lab's system, including Ocuco LMS labs, with no re-entry on either end.",
  },
  {
    n: "04",
    title: "Track",
    body: "Lab production events flow back as one shared status the practice and the lab both trust.",
  },
  {
    n: "05",
    title: "Notify",
    body: "The patient is updated automatically at each milestone, so the front desk stops fielding status calls.",
  },
];

const sides = [
  {
    title: "Practices",
    body: "Remove double entry, see every lab in one queue, and let patients stop calling. Priced per location.",
  },
  {
    title: "Labs",
    body: "One integration to receive clean, structured orders from every practice on the network.",
  },
  {
    title: "Practice Management System & LMS partners",
    body: "A modern optical ordering surface you can offer your customers without building it yourself.",
  },
  {
    title: "Groups & investors",
    body: "Network infrastructure: every practice added makes every connected lab more valuable, and the reverse.",
  },
];

function WhatWeDoPage() {
  return (
    <>
      <LfPageHero
        eyebrow="What we do"
        title="Submit once. Everything else follows."
        body={DESC}
      />
      <LfSection>
        <div className="grid gap-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 50} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">
                  {step.n}
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">{step.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12">
          <OrderStatusCard caption="illustration of the order loop · demo data" />
        </div>
      </LfSection>
      <LfSection className="bg-secondary/40">
        <LfEyebrow>Who it's for</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          Four sides of the same order.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {sides.map((side, i) => (
            <Reveal key={side.title} delay={i * 60} className="rounded-3xl border border-border bg-card p-6 sm:p-7">
              <h3 className="font-display text-xl font-semibold">{side.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{side.body}</p>
            </Reveal>
          ))}
        </div>
      </LfSection>
      <FinalBand
        title="Book a demo"
        primary={{ to: "/contact", label: "Request early access" }}
      />
    </>
  );
}
