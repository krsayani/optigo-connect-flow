import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./primitives";

const people = [
  {
    name: "Dr. Bilal Ismail",
    detail: "Optometrist",
    image: "/founders/bilal-ismail.png",
    alt: "Dr. Bilal Ismail, Founder of OptiGo",
  },
  {
    name: "Hamza Shaikh",
    detail: "",
    image: "/founders/hamza-shaikh.jpg",
    alt: "Hamza Shaikh, Co-Founder of OptiGo",
  },
];

const founders = people.map((person, i) => ({
  ...person,
  role: i === 0 ? "Founder" : "Co-Founder",
}));

export function MeetTheFounders() {
  return (
    <Section id="founders">
      <SectionHeading
        align="center"
        eyebrow="Meet the Founders"
        title="Built by people who understand the problem."
        body="Optical technology has advanced dramatically, but many of the workflows connecting practices, laboratories, and patients remain fragmented. We're building OptiGo to change that."
      />

      <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
        {founders.map((person, i) => (
          <Reveal key={person.name} delay={i * 80}>
            <article className="lift overflow-hidden rounded-3xl border border-border bg-background shadow-card">
              <div className="aspect-[4/5] overflow-hidden bg-mist">
                <img
                  src={person.image}
                  alt={person.alt}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="px-6 py-6 text-center">
                <h3 className="font-display text-xl font-bold tracking-tight text-navy">
                  {person.name}
                </h3>
                <p className="mt-1.5 text-sm font-semibold text-electric">{person.role}</p>
                {person.detail && (
                  <p className="mt-1 text-sm text-muted-foreground">{person.detail}</p>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
