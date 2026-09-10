import { Reveal } from "./reveal";
import { LfEyebrow, LfSection } from "./lf";

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
    alt: "Dr. Bilal Ismail, Founder of LensFlow",
  },
  {
    name: "Hamza Shaikh",
    detail: "CTO",
    image: "/founders/hamza-shaikh.jpg",
    alt: "Hamza Shaikh, Co-Founder of LensFlow",
  },
  {
    name: "Dr. Karim Sayani",
    detail: "Multi-Location Practice Owner",
    image: "/founders/karim-sayani.png",
    alt: "Dr. Karim Sayani, Co-Founder of LensFlow",
  },
  {
    name: "Salman Jiwani",
    detail: "Multi-Location Practice Owner",
    image: "/founders/salman-jiwani.jpg",
    alt: "Salman Jiwani, Co-Founder of LensFlow",
  },
];

const founders = people.map((person, i) => ({
  ...person,
  role: i === 0 ? "Founder" : "Co-Founder",
}));

export function MeetTheFounders({ compact = false }: { compact?: boolean }) {
  return (
    <LfSection id="founders" className="scroll-mt-28">
      <div className="mx-auto max-w-3xl text-center">
        <LfEyebrow>The team</LfEyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold sm:text-5xl">
          {compact ? "The team building LensFlow." : "Built by people who understand the problem."}
        </h2>
        {!compact ? (
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Optical technology has advanced dramatically, but many of the workflows connecting
            practices, laboratories, and patients remain fragmented. We're building LensFlow to
            change that.
          </p>
        ) : null}
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {founders.map((person, i) => (
          <Reveal key={person.name} delay={i * 80}>
            <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.alt ?? person.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary via-accent/40 to-signal/15">
                    <span className="font-display text-lg font-semibold tracking-tight text-muted-foreground sm:text-xl">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>
              <div className="px-6 py-6 text-center">
                <h3 className="font-display text-xl font-semibold tracking-tight">{person.name}</h3>
                <p className="mt-1.5 text-sm font-medium text-signal">{person.role}</p>
                {person.detail ? (
                  <p className="mt-1 text-sm text-muted-foreground">{person.detail}</p>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </LfSection>
  );
}
