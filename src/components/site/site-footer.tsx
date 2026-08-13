import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { OptiGoWordmark } from "./logo";
import { goToHomeHash } from "./site-nav";

const columns = [
  {
    title: "Product",
    links: [
      { label: "The Problem", href: "#problem" },
      { label: "The Solution", href: "#solution" },
      { label: "The Product", href: "#product" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Who It's For", href: "#who" },
      { label: "Log in", to: "/login" },
      { label: "Sign Up", href: "#get-started" },
      { label: "Request a Demo", href: "#contact" },
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
  const pathname = useLocation({ select: (l) => l.pathname });
  const navigate = useNavigate();

  const onHashClick = (href: string) => {
    goToHomeHash(href, pathname, navigate);
  };

  return (
    <footer className="border-t border-border bg-mist">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onHashClick("#top");
              }}
            >
              <OptiGoWordmark />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              One platform for every optical lab order.
            </p>
            <div className="mt-6 h-px w-24 hairline-x" />
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Automated ordering, communication, tracking, payments, and lab
              intelligence—connecting every PMS to every LMS.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"href" in l ? (
                      <a
                        href={l.href}
                        onClick={(e) => {
                          e.preventDefault();
                          onHashClick(l.href);
                        }}
                        className="text-sm text-muted-foreground transition-colors hover:text-electric"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-electric"
                      >
                        {l.label}
                      </Link>
                    )}
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
            Connecting every PMS to every LMS.
          </p>
        </div>
      </div>
    </footer>
  );
}
