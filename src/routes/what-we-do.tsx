import { createFileRoute } from "@tanstack/react-router";
import { Cable, GitBranch, Radar, MessagesSquare, Layers, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { HowItWorksStages } from "@/components/site/how-it-works-stages";
import { ProblemContrast } from "@/components/site/problem-contrast";
import { OrderTracker } from "@/components/site/order-tracker";
import {
  PageHero,
  Section,
  SectionHeading,
  CTAButton,
  FeatureCard,
} from "@/components/site/primitives";
import { FinalCTA } from "@/components/site/sections";

const TITLE = "What We Do | LensFlow Connected Optical Workflow";
const DESC =
  "LensFlow connects practices, EHR systems, optical laboratories, and patients through one workflow: connect, route, track, and communicate.";

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

const capabilities = [
  {
    icon: <Cable className="h-4 w-4" />,
    title: "Connect the systems you already use",
    body: "Interface with practice-management and EHR systems rather than replacing them.",
  },
  {
    icon: <GitBranch className="h-4 w-4" />,
    title: "Route orders to the right lab",
    body: "Optical order information moves through a streamlined digital workflow toward the laboratory.",
  },
  {
    icon: <Radar className="h-4 w-4" />,
    title: "Track progress in one place",
    body: "A consistent status model across connected laboratory workflows — from submission through pickup.",
  },
  {
    icon: <MessagesSquare className="h-4 w-4" />,
    title: "Communicate without the chase",
    body: "Practice-facing and patient-facing views built from the same underlying order record.",
  },
  {
    icon: <Layers className="h-4 w-4" />,
    title: "Work across locations",
    body: "One operational surface across locations, staff roles, and laboratory relationships.",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: "Build on trust",
    body: "Role-based access and responsible data handling as foundational considerations.",
  },
];

function WhatWeDoPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={
          <>
            One connected <span className="text-gradient">optical workflow.</span>
          </>
        }
        body="LensFlow moves optical order information from the practice or EHR through the laboratory workflow and back to the practice and patient — so staff stop re-entering, chasing, and calling for the same update."
      >
        <div className="flex flex-wrap gap-3">
          <CTAButton to="/demo">Request a Demo</CTAButton>
          <CTAButton to="/how-it-works" variant="ghost">
            See how it works
          </CTAButton>
        </div>
      </PageHero>

      <Section tone="mist">
        <SectionHeading
          eyebrow="The work"
          title="What LensFlow is designed to do."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <FeatureCard icon={c.icon} title={c.title} body={c.body} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Four stages" title="Connect. Route. Track. Communicate." />
        <HowItWorksStages />
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="Before and after"
          title="Optical ordering shouldn't be this complicated."
        />
        <ProblemContrast />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Visibility"
          title="Two views of the same order."
          body="Staff see every milestone in lab detail; the patient sees a simple, plain-language version of the same record."
        />
        <OrderTracker />
      </Section>

      <FinalCTA />
    </>
  );
}
