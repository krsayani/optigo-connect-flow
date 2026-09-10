import { Link } from "@tanstack/react-router";
import { LensFlowWordmark } from "./logo";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "What we do", to: "/what-we-do" },
      { label: "Technology", to: "/technology" },
    ],
  },
  {
    title: "Audiences",
    links: [
      { label: "For practices", to: "/for-practices" },
      { label: "For labs", to: "/for-labs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <LensFlowWordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The connectivity layer for eyecare — one flow for every optical order, from exam
              room to lab to patient.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
          <p className="text-xs text-muted-foreground">© 2026 LensFlow. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">
            Early-stage software company. Product capabilities in active development.
          </p>
        </div>
      </div>
    </footer>
  );
}
