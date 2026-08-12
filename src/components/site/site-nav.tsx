import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptiGoWordmark } from "./logo";

const nav = [
  { label: "The Problem", href: "#problem" },
  { label: "The Solution", href: "#solution" },
  { label: "The Product", href: "#product" },
  { label: "Who It's For", href: "#who" },
] as const;

function scrollToHash(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNavClick = (href: string) => {
    setOpen(false);
    // Allow the hash to update, then smooth-scroll
    window.history.pushState(null, "", href);
    scrollToHash(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/75 shadow-[0_8px_30px_-20px_oklch(0.24_0.058_262/0.45)] backdrop-blur-xl"
          : "border-b border-transparent bg-background/30 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-6 px-5 sm:px-8">
        <a
          href="#top"
          className="shrink-0"
          aria-label="OptiGo home"
          onClick={(e) => {
            e.preventDefault();
            onNavClick("#top");
          }}
        >
          <OptiGoWordmark />
        </a>

        <nav className="hidden flex-1 items-center gap-0.5 md:flex" aria-label="Main">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.href);
              }}
              className="rounded-xl px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy xl:px-3"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onNavClick("#contact");
            }}
            className="rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-navy"
          >
            Request a Demo
          </a>
          <a
            href="#get-started"
            onClick={(e) => {
              e.preventDefault();
              onNavClick("#get-started");
            }}
            className="group inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:bg-electric"
          >
            Sign Up
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-navy md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-4 sm:px-8" aria-label="Mobile">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.href);
                }}
                className="rounded-xl px-3 py-3 text-sm font-medium text-navy hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                onNavClick("#contact");
              }}
              className="rounded-xl px-3 py-3 text-sm font-medium text-navy hover:bg-muted"
            >
              Request a Demo
            </a>
            <a
              href="#get-started"
              onClick={(e) => {
                e.preventDefault();
                onNavClick("#get-started");
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Sign Up
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
