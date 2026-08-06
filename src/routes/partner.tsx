import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/reveal";
import { PartnerForm } from "@/components/site/forms";
import { PageHero, Section } from "@/components/site/primitives";
import { InfrastructureSection } from "@/components/site/sections";

const TITLE = "Partner With OptiGo | Integration Partnerships";
const DESC =
  "Optical laboratories, EHR and practice-management providers, and technology partners: connect with the OptiGo integrations team.";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/partner" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/partner" }],
  }),
  component: PartnerPage,
});

function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner with us"
        title={
          <>
            Become an <span className="text-gradient">integration partner.</span>
          </>
        }
        body="We're building the connectivity layer for optical care — and we're doing it alongside the laboratories, EHR providers, and technology companies already serving this industry."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <Reveal className="rounded-3xl border border-border bg-background p-6 shadow-card sm:p-9">
            <PartnerForm />
          </Reveal>
          <Reveal delay={120} className="space-y-4">
            {[
              {
                t: "Optical laboratories",
                b: "Cleaner digital handoffs, fewer repetitive status inquiries, and a modern path to the practices you serve.",
              },
              {
                t: "EHR / practice management",
                b: "A connectivity layer that complements your platform rather than competing with it.",
              },
              {
                t: "Technology partners",
                b: "Infrastructure being built for a broader optometry ecosystem.",
              },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl border border-border bg-mist p-6">
                <h3 className="text-base font-semibold text-navy">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.b}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <InfrastructureSection />
    </>
  );
}
