import { Link } from "@tanstack/react-router";
import { OptiGoWordmark } from "./logo";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Platform", to: "/platform" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Integrations", to: "/integrations" },
    ],
  },
  {
    title: "Who It's For",
    links: [
      { label: "For Practices", to: "/for-practices" },
      { label: "For Labs", to: "/for-labs" },
      { label: "Sign Up", to: "/signup" },
      { label: "Partner With Us", to: "/partner" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/demo" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-mist">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <OptiGoWordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Building the connected future of optometry.
            </p>
            <div className="mt-6 h-px w-24 hairline-x" />
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-muted-foreground">
              OptiGo is an early-stage software infrastructure company. Product capabilities
              described on this site are in active development.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-electric"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 OptiGo. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Starting with optical. Building for the future of optometry.
          </p>
        </div>
      </div>
    </footer>
  );
}
