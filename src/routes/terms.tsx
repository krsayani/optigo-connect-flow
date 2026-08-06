import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/primitives";
import { LegalBody } from "@/components/site/legal-body";

const TITLE = "Terms of Use | OptiGo";
const DESC =
  "The terms governing use of the OptiGo website and the informational nature of the content presented here.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/terms" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        body="Last updated: January 2026. These terms govern your use of the OptiGo website."
      />
      <Section>
        <LegalBody
          sections={[
            {
              h: "Informational purpose",
              p: "This website is provided for general informational purposes. OptiGo is an early-stage software company, and platform capabilities described here are in active development. Nothing on this site constitutes a commitment to deliver a specific feature, integration, or timeline.",
            },
            {
              h: "Demonstration content",
              p: "Product interfaces, orders, patient names, laboratories, and statuses shown on this site are fictional examples created for illustration.",
            },
            {
              h: "Third-party names",
              p: "References to third-party systems are for identification only. A reference does not indicate an active integration, endorsement, partnership, or supported connection unless specifically stated.",
            },
            {
              h: "No professional advice",
              p: "Content on this site is not clinical, legal, or regulatory advice. You are responsible for your own compliance obligations.",
            },
            {
              h: "Intellectual property",
              p: "The OptiGo name, wordmark, site design, and content are the property of OptiGo and may not be used without permission.",
            },
            {
              h: "Limitation of liability",
              p: "This website is provided on an \u201Cas is\u201D basis without warranties of any kind. To the fullest extent permitted by law, OptiGo is not liable for any damages arising from your use of this site.",
            },
            {
              h: "Contact",
              p: "Questions about these terms can be submitted through the contact forms on this site.",
            },
          ]}
        />
      </Section>
    </>
  );
}
