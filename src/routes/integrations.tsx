import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { PageHero, Section, SectionHeading, CTAButton } from "@/components/site/primitives";
import { FinalCTA } from "@/components/site/sections";

const TITLE = "Integrations | Building the Connected Optical Ecosystem";
const DESC =
  "OptiGo is actively working with industry partners to connect with the practice-management, EHR, and laboratory systems practices already use.";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/integrations" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/integrations" }],
  }),
  component: IntegrationsPage,
});

const partners = [
  {
    name: "Crystal Practice Management",
    category: "Practice management",
    note: "Working toward connectivity for optical order information.",
  },
  {
    name: "DVI",
    category: "Laboratory systems",
    note: "Working toward connectivity for laboratory order workflows.",
  },
  {
    name: "Ocuco",
    category: "Practice & lab software",
    note: "Working toward connectivity across practice and lab workflows.",
  },
];

const placeholders = [
  "More EHR integrations",
  "More laboratory integrations",
  "More connections coming",
];

function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Integrations"
        title={
          <>
            Building the connected{" "}
            <span className="text-gradient">optical ecosystem.</span>
          </>
        }
        body="We're actively working with industry partners to connect OptiGo with the systems practices and laboratories already use."
      >
        <CTAButton to="/partner">Partner With Us</CTAButton>
      </PageHero>

      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          {partners.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div className="lift relative h-full overflow-hidden rounded-2xl border border-border bg-background p-7">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-electric/[0.07] blur-2xl" />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-electric/15 to-aqua/20 font-display text-sm font-bold text-navy">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="mt-5 eyebrow">{p.category}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-navy">
                    {p.name}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-electric/25 bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-electric">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-soft" />
                    Integration in development
                  </span>
                  <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
                    {p.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <p className="mt-8 rounded-2xl border border-border bg-mist px-5 py-4 text-[12px] leading-relaxed text-muted-foreground">
            These integrations are currently in development. Listing a system here does not
            indicate an active integration, endorsement, partnership, or supported connection
            unless specifically stated.
          </p>
        </Reveal>
      </Section>

      <Section tone="mist">
        <SectionHeading eyebrow="Roadmap of connections" title="The ecosystem keeps growing." />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {placeholders.map((p, i) => (
            <Reveal key={p} delay={i * 80}>
              <div className="flex h-full items-center gap-4 rounded-2xl border border-dashed border-border bg-background/60 p-7">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Plus className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-navy/70">{p}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-12 text-center">
          <p className="text-lg font-semibold text-navy sm:text-xl">
            Interested in integrating with OptiGo?
          </p>
          <div className="mt-6 flex justify-center">
            <CTAButton to="/partner">Partner With Us</CTAButton>
          </div>
        </Reveal>
      </Section>

      <FinalCTA />
    </>
  );
}
