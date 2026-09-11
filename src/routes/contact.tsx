import { createFileRoute } from "@tanstack/react-router";
import { LfPageHero, LfSection } from "@/components/site/lf";
import { ContactForm } from "@/components/site/forms";
import { Reveal } from "@/components/site/reveal";

const TITLE = "Contact LensFlow | Request early access";
const DESC =
  "Whether you run a practice, a lab, or a Practice Management System platform, we'd like to understand how optical orders move through your world today.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/contact" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <LfPageHero
        eyebrow="Contact"
        title="Let's talk about your workflow."
        body={DESC}
      />
      <LfSection width="copy">
        <Reveal className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-9">
          <ContactForm />
        </Reveal>
      </LfSection>
    </>
  );
}
