import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./primitives";

const people: Array<{
  name: string;
  detail: string;
  image?: string;
  alt?: string;
}> = [
  {
    name: "Dr. Bilal Ismail",
    detail: "CEO",
    image: "/founders/bilal-ismail.png",
    alt: "Dr. Bilal Ismail, Founder of OptiGo",
  },
  {
    name: "Hamza Shaikh",
    detail: "CTO",
  },
  {
    name: "Dr. Karim Sayani",
    detail: "Multi-Location Practice Owner",
    image: "/founders/karim-sayani.png",
    alt: "Dr. Karim Sayani, Co-Founder of OptiGo",
  },
  {
    name: "Salman Jiwani",
    detail: "Multi-Location Practice Owner",
  },
];

const founders = people.map((person, i) => ({
  ...person,
  role: i === 0 ? "Founder" : "Co-Founder",
}));

function initials(name: string) {
  return name
    .replace(/^Dr\.\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MeetTheFounders() {
  return (
    <Section id="founders" tone="mist">
      <SectionHeading
        align="center"
        eyebrow="Meet the Founders"
        title="Built by people who understand the problem."
        body="Optical technology has advanced dramatically, but many of the workflows connecting practices, laboratories, and patients remain fragmented. We're building OptiGo to change that."
      />

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {founders.map((person, i) => (
          <Reveal key={person.name} delay={i * 80}>
            <article className="lift overflow-hidden rounded-3xl border border-border bg-background shadow-card">
              <div className="relative aspect-[4/5] overflow-hidden bg-mist">
                {person.image ? (
                  <>
                    <img
                      src={person.image}
                      alt={person.alt ?? person.name}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/90 to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mist via-accent to-electric/15">
                    <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-navy font-display text-2xl font-extrabold tracking-tight text-on-dark">
                      {initials(person.name)}
                    </span>
                  </div>
                )}
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
