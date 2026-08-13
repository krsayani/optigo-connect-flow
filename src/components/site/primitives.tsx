import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Section({
  children,
  className,
  id,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "mist" | "dark";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28",
        tone === "mist" && "bg-mist",
        tone === "dark" && "surface-dark",
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow", tone === "dark" && "text-aqua")}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "mt-3 text-3xl font-bold leading-[1.08] sm:text-4xl lg:text-[2.9rem]",
          tone === "dark" ? "text-on-dark" : "text-navy",
        )}
      >
        {title}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-on-dark-muted" : "text-muted-foreground",
          )}
        >
          {body}
        </p>
      )}
    </Reveal>
  );
}

export function CTAButton({
  to,
  href,
  search,
  children,
  variant = "primary",
  className,
}: {
  to?: string;
  href?: string;
  search?: Record<string, string>;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light" | "outline-light";
  className?: string;
}) {
  const styles = {
    primary:
      "bg-navy text-primary-foreground hover:bg-electric shadow-[0_10px_30px_-14px_oklch(0.24_0.058_262/0.6)]",
    ghost:
      "border border-border bg-background text-navy hover:border-electric hover:text-electric",
    light: "bg-on-dark text-navy hover:bg-aqua",
    "outline-light":
      "border border-white/25 text-on-dark hover:border-aqua hover:text-aqua",
  }[variant];

  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
    styles,
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={(e) => {
          if (!href.startsWith("#")) return;
          e.preventDefault();
          window.history.pushState(null, "", href);
          document
            .getElementById(href.slice(1))
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    );
  }

  return (
    <Link
      to={(to || "/") as "/"}
      search={search as never}
      className={classes}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function FeatureCard({
  icon,
  title,
  body,
  className,
  tone = "light",
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "lift rounded-2xl p-6 sm:p-7",
        tone === "dark"
          ? "border border-white/10 bg-white/[0.04] backdrop-blur-sm"
          : "card-elevated",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full",
            tone === "dark"
              ? "bg-white/10 text-aqua"
              : "bg-accent text-electric",
          )}
        >
          {icon}
        </div>
      )}
      <h3
        className={cn(
          "text-base font-semibold",
          tone === "dark" ? "text-on-dark" : "text-navy",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed",
          tone === "dark" ? "text-on-dark-muted" : "text-muted-foreground",
        )}
      >
        {body}
      </p>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
      <div className="absolute inset-0 surface-aurora" />
      <div className="absolute inset-0 grid-mesh opacity-45" />
      <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-electric/20 blur-3xl animate-orb" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-electric">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-navy sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          {body && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {body}
            </p>
          )}
        </Reveal>
        {children && <Reveal delay={120} className="mt-9">{children}</Reveal>}
      </div>
    </section>
  );
}
