import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Network,
  Radar,
  PhoneOff,
  Blocks,
  Handshake,
} from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { InfrastructureGraphic } from "@/components/site/infrastructure-graphic";
import {
  PageHero,
  Section,
  SectionHeading,
  CTAButton,
  FeatureCard,
} from "@/components/site/primitives";
import { TrustSection, FinalCTA } from "@/components/site/sections";

const TITLE = "For Laboratories | OptiGo Lab Connectivity Infrastructure";
const DESC =
  "OptiGo is building modern infrastructure designed to make digital communication between optical laboratories and practices simpler, more transparent, and more scalable.";

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

const benefits = [
  {
    icon: <ArrowLeftRight className="h-4 w-4" />,
    title: "Cleaner digital handoffs",
    body: "Structured order information instead of re-keyed details and follow-up clarifications.",
  },
  {
    icon: <Network className="h-4 w-4" />,
    title: "Better practice connectivity",
    body: "A modern path to the practices you already serve.",
  },
  {
    icon: <Radar className="h-4 w-4" />,
    title: "Order visibility",
    body: "Progress shared once and surfaced consistently to the practice and patient.",
  },
  {
    icon: <PhoneOff className="h-4 w-4" />,
    title: "Reduced status inquiries",
    body: "Fewer repetitive calls and emails asking where an order stands.",
  },
  {
    icon: <Blocks className="h-4 w-4" />,
    title: "Modern integration infrastructure",
    body: "Built to fit alongside existing lab management systems and processes.",
  },
  {
    icon: <Handshake className="h-4 w-4" />,
    title: "Ecosystem reach",
    body: "An opportunity to connect with practices through the OptiGo ecosystem.",
  },
];

function ForLabsPage() {
  return (
    <>
      <PageHero
        eyebrow="For laboratories"
        title={
          <>
            A better connection between{" "}
            <span className="text-gradient">labs and practices.</span>
          </>
        }
        body="Orders arrive structured and complete, status flows back once, and the practices you already serve stay in sync without a phone call."
      >
        <CTAButton to="/partner">Become an Integration Partner</CTAButton>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Positioning"
          title="Infrastructure for your customer relationships — not a replacement for your lab."
          body="OptiGo does not manufacture, fulfill, or compete for lab work. We're building the connective layer that helps laboratories exchange order and status information with practices more effectively."
        />
      </Section>

      <Section tone="mist">
        <SectionHeading eyebrow="Benefits" title="What connecting to OptiGo is designed to offer." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <FeatureCard icon={b.icon} title={b.title} body={b.body} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="absolute inset-0 grid-mesh-dark opacity-60" />
        <div className="relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Integration model"
              title="One connection. Many practices."
              body="Rather than building and maintaining separate connections practice by practice, laboratories can connect once into an architecture designed to reach practices across the OptiGo ecosystem."
            />
            <Reveal delay={140} className="mt-9">
              <CTAButton to="/partner" variant="light">
                Talk to our team
              </CTAButton>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <InfrastructureGraphic />
          </Reveal>
        </div>
      </Section>

      <TrustSection />
      <FinalCTA />
    </>
  );
}
