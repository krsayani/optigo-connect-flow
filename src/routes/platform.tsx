import { createFileRoute } from "@tanstack/react-router";
import { Cable, GitBranch, Radar, MessagesSquare, Layers, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import {
  PageHero,
  Section,
  SectionHeading,
  CTAButton,
  FeatureCard,
} from "@/components/site/primitives";
import {
  InfrastructureSection,
  WhyOptiGo,
  FinalCTA,
} from "@/components/site/sections";

const TITLE = "Platform | OptiGo Optical Workflow Infrastructure";
const DESC =
  "The OptiGo platform is a connectivity and automation layer between optometry practices, EHR systems, optical laboratories, and patients.";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/platform" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/platform" }],
  }),
  component: PlatformPage,
});

const capabilities = [
  {
    icon: <Cable className="h-4 w-4" />,
    title: "Connectivity layer",
    body: "Designed to interface with practice-management and EHR systems rather than replace them.",
  },
  {
    icon: <GitBranch className="h-4 w-4" />,
    title: "Order routing",
    body: "Optical order information moves through a streamlined digital workflow toward the laboratory.",
  },
  {
    icon: <Radar className="h-4 w-4" />,
    title: "Status model",
    body: "A consistent way to represent order progress across connected laboratory workflows.",
  },
  {
    icon: <MessagesSquare className="h-4 w-4" />,
    title: "Communication",
    body: "Practice-facing and patient-facing views built from the same underlying order record.",
  },
  {
    icon: <Layers className="h-4 w-4" />,
    title: "Multi-location ready",
    body: "One operational surface across locations, staff roles, and laboratory relationships.",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: "Security-conscious by design",
    body: "Role-based access and responsible data handling as foundational considerations.",
  },
];

function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title={
          <>
            One connected platform.
            <br />
            <span className="text-gradient">A bigger vision for optometry.</span>
          </>
        }
        body="OptiGo is being built as infrastructure: an architecture intended to connect multiple EHR systems, optical laboratories, practices, and patients through a single workflow."
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
          eyebrow="Capabilities"
          title="What the platform is designed to do."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <FeatureCard icon={c.icon} title={c.title} body={c.body} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      <InfrastructureSection />
      <WhyOptiGo />
      <FinalCTA />
    </>
  );
}
