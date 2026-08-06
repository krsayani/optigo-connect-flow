import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksStages } from "@/components/site/how-it-works-stages";
import { ProblemContrast } from "@/components/site/problem-contrast";
import { OrderTracker } from "@/components/site/order-tracker";
import { PageHero, Section, SectionHeading, CTAButton } from "@/components/site/primitives";
import { InfrastructureSection, FinalCTA } from "@/components/site/sections";

const TITLE = "How It Works | OptiGo Connected Optical Workflow";
const DESC =
  "Connect, route, track, communicate: how OptiGo moves optical order information between practices, EHR systems, laboratories, and patients.";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/how-it-works" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            One connected <span className="text-gradient">workflow.</span>
          </>
        }
        body="Optical order information moves from the practice or EHR into OptiGo, through the appropriate laboratory workflow, and back to the practice and patient as the order progresses."
      >
        <CTAButton to="/demo">Request a Demo</CTAButton>
      </PageHero>

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
          title="Know where every order stands."
          body="OptiGo is being designed to give practices better visibility into the optical order lifecycle from submission through completion."
        />
        <OrderTracker />
      </Section>

      <InfrastructureSection />
      <FinalCTA />
    </>
  );
}
