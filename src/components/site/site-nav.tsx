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
          ? "border-b border-border/70 bg-background/75 shadow-[0_8px_30px_-20px_oklch(0.24_0.058_262/0.45)] backdrop-blur-xl"
          : "border-b border-transparent bg-background/30 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link to="/" className="shrink-0" aria-label="OptiGo home">
          <OptiGoWordmark />
        </Link>

        <nav className="hidden flex-1 items-center gap-0.5 md:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-xl px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy xl:px-3"
              activeProps={{ className: "text-navy bg-muted" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            to="/demo"
            className="rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-navy"
          >
            Request Demo
          </Link>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-navy px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:bg-electric"
          >
            Sign Up
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
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
              <Link
                key={item.to}
                to={item.to}
                className="rounded-xl px-3 py-3 text-sm font-medium text-navy hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/demo"
              className="rounded-xl px-3 py-3 text-sm font-medium text-navy hover:bg-muted"
            >
              Request Demo
            </Link>
            <Link
              to="/signup"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
