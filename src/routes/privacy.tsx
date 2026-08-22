import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/primitives";
import { LegalBody } from "@/components/site/legal-body";

const TITLE = "Privacy Policy | LensFlow";
const DESC =
  "How LensFlow handles information submitted through this website, and the privacy principles guiding our platform development.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        body="Last updated: January 2026. This policy describes how LensFlow handles information submitted through this website."
      />
      <Section>
        <LegalBody
          sections={[
            {
              h: "Information we collect",
              p: "We collect the information you voluntarily provide through our demo and partner forms, such as your name, company, role, email address, phone number, and the details you include in your message. We also collect standard technical information such as browser type and pages visited.",
            },
            {
              h: "How we use information",
              p: "We use the information you submit to respond to your inquiry, schedule conversations, and understand the needs of practices, laboratories, and technology partners. We do not sell your information.",
            },
            {
              h: "Patient information",
              p: "This website is not intended for the submission of patient health information. Please do not include patient-identifying details in any web form. Any demonstration data shown on this site is fictional.",
            },
            {
              h: "Privacy-focused design",
              p: "LensFlow is being developed with security and privacy as foundational considerations, including role-based access and responsible data handling practices in our platform architecture.",
            },
            {
              h: "Data retention",
              p: "We retain inquiry information only as long as needed to respond to and manage our relationship with you, unless a longer period is required for legitimate business or legal reasons.",
            },
            {
              h: "Your choices",
              p: "You may request that we update or delete the contact information you submitted by reaching out through the contact forms on this site.",
            },
            {
              h: "Changes to this policy",
              p: "As LensFlow's platform develops, this policy may be updated. Material changes will be reflected by the updated date above.",
            },
          ]}
        />
      </Section>
    </>
  );
}
