import { createFileRoute } from "@tanstack/react-router";
import { LfPageHero, LfSection } from "@/components/site/lf";
import { LegalBody } from "@/components/site/legal-body";

const TITLE = "Privacy Policy | LensFlow";
const DESC =
  "How LensFlow handles information submitted through this website.";

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
      <LfPageHero
        eyebrow="Legal"
        title="Privacy Policy"
        body="Last updated August 2026."
      />
      <LfSection width="copy">
        <LegalBody
          sections={[
            {
              h: "Information we collect",
              p: "We collect the details you choose to send us through our contact form — such as your name, work email, organization type, and message — plus basic, aggregated analytics about site usage.",
            },
            {
              h: "How we use it",
              p: "We use your information to respond to your inquiry, evaluate early-access fit, and improve this website. We do not sell personal information.",
            },
            {
              h: "Data handling",
              p: "Information is stored with reputable service providers and access is limited to team members who need it. We apply least-privilege access and review it regularly.",
            },
            {
              h: "Your choices",
              p: "You can ask us to update or delete the information you submitted at any time by contacting us through this site.",
            },
            {
              h: "Changes",
              p: "As LensFlow develops, this policy may change. Material updates will be reflected on this page.",
            },
          ]}
        />
      </LfSection>
    </>
  );
}
