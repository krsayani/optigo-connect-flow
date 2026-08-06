import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptiGoWordmark } from "./logo";

const nav = [
  { label: "Platform", to: "/platform" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "For Practices", to: "/for-practices" },
  { label: "For Labs", to: "/for-labs" },
  { label: "Integrations", to: "/integrations" },
  { label: "About", to: "/about" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link to="/" className="shrink-0" aria-label="OptiGo home">
          <OptiGoWordmark />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
              activeProps={{ className: "text-navy bg-muted" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <Link
            to="/partner"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-navy"
          >
            Partner With Us
          </Link>
          <Link
            to="/demo"
            className="group inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-electric"
          >
            Request a Demo
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-navy lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-4 sm:px-8" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-3 text-sm font-medium text-navy hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/partner"
              className="rounded-lg px-3 py-3 text-sm font-medium text-navy hover:bg-muted"
            >
              Partner With Us
            </Link>
            <Link
              to="/demo"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Request a Demo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
