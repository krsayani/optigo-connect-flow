import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function LfSection({
  children,
  className,
  id,
  width = "wide",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  width?: "wide" | "copy";
}) {
  return (
    <section id={id} className={cn("relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28", className)}>
      <div className={cn("relative mx-auto", width === "copy" ? "max-w-3xl" : "max-w-6xl")}>
        {children}
      </div>
    </section>
  );
}

export function LfEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function LfHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  body?: ReactNode | undefined;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <LfEyebrow>{eyebrow}</LfEyebrow> : null}
      <h1
        className={cn(
          "font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[3.4rem]",
          eyebrow && "mt-4",
        )}
      >
        {title}
      </h1>
      {body ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

export function LfPageHero({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow?: string | undefined;
  title: ReactNode;
  body?: ReactNode | undefined;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="soft-wash absolute -inset-x-[20%] -top-[30%] h-[160%] opacity-80" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 40%, var(--background) 100%)" }}
        />
      </div>
      <div className="relative mx-auto max-w-5xl">
        <LfHeading eyebrow={eyebrow} title={title} body={body} />
        {actions ? <div className="mt-10 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function LfButton({
  to,
  children,
  variant = "primary",
  className,
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  return (
    <Link
      to={to as "/"}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-300 hover:-translate-y-0.5",
        variant === "primary" &&
          "bg-foreground text-background hover:shadow-[0_18px_40px_-20px_color-mix(in_oklab,var(--signal)_60%,transparent)]",
        variant === "ghost" &&
          "border border-border bg-card/60 text-foreground backdrop-blur hover:border-signal/45",
        className,
      )}
    >
      {variant === "primary" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ animation: "sweep 1.1s ease-in-out infinite" }}
        />
      ) : null}
      <span className="relative inline-flex items-center gap-2">
        {children}
        {variant === "primary" ? <ArrowRight className="h-4 w-4" /> : null}
      </span>
    </Link>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border py-4">
      <div className="lf-marquee flex w-max gap-10 pr-10">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FinalBand({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: string;
  primary: { to: string; label: string };
  secondary?: { to: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="soft-wash absolute inset-0 opacity-70" />
      </div>
      <div className="relative mx-auto max-w-4xl text-center">
        {eyebrow ? <LfEyebrow className="justify-center">{eyebrow}</LfEyebrow> : null}
        <h2 className="mt-4 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
          {title}
        </h2>
        {body ? (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {body}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <LfButton to={primary.to}>{primary.label}</LfButton>
          {secondary ? (
            <LfButton to={secondary.to} variant="ghost">
              {secondary.label}
            </LfButton>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "light" }) {
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm">
          <span
            className={cn(
              "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
              tone === "light" ? "bg-signal-soft" : "bg-signal",
            )}
          />
          <span className={tone === "light" ? "text-white/85" : "text-foreground/85"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
