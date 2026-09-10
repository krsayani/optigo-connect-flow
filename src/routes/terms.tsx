import { createFileRoute } from "@tanstack/react-router";
import { LfPageHero, LfSection } from "@/components/site/lf";
import { LegalBody } from "@/components/site/legal-body";

const TITLE = "Terms of Use | LensFlow";
const DESC = "Terms governing use of the LensFlow website.";

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
      <LfPageHero
        eyebrow="Legal"
        title="Terms of Use"
        body="Last updated August 2026."
      />
      <LfSection width="copy">
        <LegalBody
          sections={[
            {
              h: "About this site",
              p: "This website describes LensFlow, an early-stage software company. Product capabilities described here are in active development and may change.",
            },
            {
              h: "Acceptable use",
              p: "You agree not to misuse this site, attempt to disrupt it, or access it in a way that violates applicable law.",
            },
            {
              h: "Intellectual property",
              p: "The LensFlow name, brand, content, and design on this site are owned by LensFlow unless otherwise noted.",
            },
            {
              h: "No warranty",
              p: "This site is provided on an as-is basis without warranties of any kind. Nothing here constitutes a binding offer or clinical guidance.",
            },
            {
              h: "Contact",
              p: "Questions about these terms can be sent to us through the contact page.",
            },
          ]}
        />
      </LfSection>
    </>
  );
}
