import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/reveal";
import { DemoForm } from "@/components/site/forms";
import { PageHero, Section } from "@/components/site/primitives";
import { TrustSection } from "@/components/site/sections";

const TITLE = "Request a Demo | OptiGo";
const DESC =
  "See how OptiGo is being built to connect your practice, EHR system, and optical laboratories through one streamlined optical ordering workflow.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/demo" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/demo" }],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Request a demo"
        title={
          <>
            See OptiGo <span className="text-gradient">in action.</span>
          </>
        }
        body="Tell us a little about your practice and the systems you use today. We'll follow up to walk you through what we're building."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <Reveal className="rounded-3xl border border-border bg-background p-6 shadow-card sm:p-9">
            <DemoForm />
          </Reveal>
          <Reveal delay={120} className="space-y-4">
            <div className="rounded-2xl border border-border bg-mist p-6">
              <p className="eyebrow">What to expect</p>
              <ul className="mt-4 space-y-3 text-sm text-navy/85">
                {[
                  "A short conversation about your current optical ordering workflow",
                  "A walkthrough of the OptiGo platform experience being built",
                  "A clear picture of where integrations stand today",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-electric/20 surface-dark p-6">
              <p className="eyebrow text-aqua">Also</p>
              <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">
                If you're an optical laboratory, EHR provider, or technology company, the
                partner form is the fastest path to our integrations team.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <TrustSection />
    </>
  );
}
