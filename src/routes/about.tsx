import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { PageHero, Section, SectionHeading, CTAButton } from "@/components/site/primitives";
import { FinalCTA } from "@/components/site/sections";

const TITLE = "About OptiGo | Infrastructure for Modern Optometry";
const DESC =
  "OptiGo was founded around a simple observation: optical technology has advanced, but the workflows connecting practices, laboratories, and patients remain fragmented.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/about" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const founders = [
  { role: "Founder" },
  { role: "Founder" },
  { role: "Executive Team" },
  { role: "Executive Team" },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Built by people who{" "}
            <span className="text-gradient">understand the problem.</span>
          </>
        }
        body="OptiGo was founded around a simple observation: optical technology has advanced dramatically, but many of the workflows connecting practices, laboratories, and patients remain fragmented. We're building OptiGo to change that."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Our approach"
            title="We're building infrastructure, not another portal."
            body="OptiGo's architecture is intended to connect multiple EHR systems, optical laboratories, practices, and patients — so the industry gains a shared connectivity layer rather than one more disconnected login."
          />
          <Reveal delay={120} className="space-y-4">
            {[
              {
                t: "Start where the friction is highest",
                b: "Optical ordering is one of the most fragmented workflows in optometry. That's the wedge.",
              },
              {
                t: "Design for many participants",
                b: "Practices, EHRs, laboratories, and patients each need a different view of the same order.",
              },
              {
                t: "Build for what's next",
                b: "Today's workflow is only the beginning of what a connected optometry industry can look like.",
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

      <Section tone="mist">
        <SectionHeading eyebrow="Team" title="The team building OptiGo." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {founders.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="lift h-full rounded-2xl border border-border bg-background p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-electric/15 to-aqua/20">
                  <User className="h-6 w-6 text-navy/40" />
                </div>
                <p className="mt-5 text-sm font-semibold text-navy">Team member</p>
                <p className="mt-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  {f.role}
                </p>
                <p className="mt-4 text-[11.5px] text-muted-foreground">Details coming soon</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-10 flex justify-center">
          <CTAButton to="/demo" variant="ghost">
            Get in touch
          </CTAButton>
        </Reveal>
      </Section>

      <FinalCTA />
    </>
  );
}
