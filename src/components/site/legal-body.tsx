import { Reveal } from "./reveal";

export function LegalBody({ sections }: { sections: { h: string; p: string }[] }) {
  return (
    <div className="max-w-3xl space-y-8">
      {sections.map((s, i) => (
        <Reveal key={s.h} delay={i * 50}>
          <h2 className="text-lg font-semibold text-navy sm:text-xl">{s.h}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {s.p}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
