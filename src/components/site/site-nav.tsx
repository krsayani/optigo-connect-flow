import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LensFlowWordmark } from "./logo";

const nav = [
  { label: "What we do", to: "/what-we-do" },
  { label: "Technology", to: "/technology" },
  { label: "For practices", to: "/for-practices" },
  { label: "For labs", to: "/for-labs" },
  { label: "Team", to: "/", hash: "founders" },
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
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-5",
          scrolled
            ? "border border-border bg-background/80 shadow-soft backdrop-blur-xl"
            : "border border-transparent",
        )}
      >
        <Link to="/" className="shrink-0" aria-label="LensFlow home">
          <LensFlowWordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={"hash" in item ? item.hash : undefined}
              activeOptions={"hash" in item ? { exact: true, includeHash: true } : undefined}
              className="rounded-full px-3.5 py-2 text-[13.5px] text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary/70" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13.5px] font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Request access
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-border bg-background p-3 shadow-soft lg:hidden">
          <nav className="grid gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={"hash" in item ? item.hash : undefined}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background"
            >
              Request access
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
