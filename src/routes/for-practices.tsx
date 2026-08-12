import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardCheck,
  Layers,
  Eye,
  PhoneOff,
  Users,
  Smile,
  Cable,
} from "lucide-react";
import { DashboardMockup } from "@/components/site/dashboard-mockup";
import { OrderTracker } from "@/components/site/order-tracker";
import { Reveal } from "@/components/site/reveal";
import {
  PageHero,
  Section,
  SectionHeading,
  CTAButton,
  FeatureCard,
} from "@/components/site/primitives";
import { TrustSection, FinalCTA } from "@/components/site/sections";

const TITLE = "For Practices | OptiGo Optical Order Management";
const DESC =
  "OptiGo helps optometry practices centralize optical orders, reduce repetitive data entry, and improve visibility from submission through pickup.";

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

const benefits = [
  {
    icon: <ClipboardCheck className="h-4 w-4" />,
    title: "Reduce repetitive data entry",
    body: "Order details are designed to carry through instead of being retyped.",
  },
  {
    icon: <Layers className="h-4 w-4" />,
    title: "Centralize optical orders",
    body: "One place for orders across locations and connected laboratories.",
  },
  {
    icon: <Eye className="h-4 w-4" />,
    title: "Improve order visibility",
    body: "See progress without digging through separate portals.",
  },
  {
    icon: <PhoneOff className="h-4 w-4" />,
    title: "Reduce unnecessary status calls",
    body: "Fewer inbound and outbound calls chasing the same answer.",
  },
  {
    icon: <Users className="h-4 w-4" />,
    title: "Keep staff informed",
    body: "Shared context so anyone at the front desk can answer confidently.",
  },
  {
    icon: <Smile className="h-4 w-4" />,
    title: "A better patient experience",
    body: "Clear, plain-language updates on where an order stands.",
  },
  {
    icon: <Cable className="h-4 w-4" />,
    title: "Connect laboratory workflows",
    body: "Designed to work with the laboratory relationships you already have.",
  },
];

function ForPracticesPage() {
  return (
    <>
      <PageHero
        eyebrow="For practices"
        title={
          <>
            Less chasing.
            <br />
            <span className="text-gradient">More patient care.</span>
          </>
        }
        body="Optical ordering takes staff time that belongs with patients. OptiGo is being built to take the repetitive parts off their plate."
      >
        <CTAButton to="/signup" search={{ type: "practice" }}>
          Sign up your practice
        </CTAButton>
      </PageHero>

      <Section>
        <SectionHeading eyebrow="Value" title="Built around how practices actually work." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <FeatureCard icon={b.icon} title={b.title} body={b.body} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading
          eyebrow="Practice view"
          title="Every optical order, at a glance."
        />
        <Reveal delay={120} className="mt-12">
          <DashboardMockup />
        </Reveal>
        <p className="mt-5 text-center text-[11px] text-muted-foreground">
          Interface shown for illustration. All records are fictional demo data.
        </p>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Patient communication"
          title="Answers before the phone rings."
        />
        <OrderTracker />
      </Section>

      <TrustSection />
      <FinalCTA />
    </>
  );
}
