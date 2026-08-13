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
      { label: "Founders", href: "#founders" },
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
    <footer className="relative overflow-hidden border-t border-white/10 surface-dark">
      <div className="absolute inset-0 grid-mesh-dark opacity-50" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-electric/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onHashClick("#top");
              }}
            >
              <OptiGoWordmark tone="light" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-dark-muted">
              One platform for every optical lab order.
            </p>
            <div className="mt-6 h-px w-24 hairline-x" />
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-on-dark-muted">
              Automated ordering, communication, tracking, payments, and lab
              intelligence—connecting every practice to every lab.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow text-aqua">{col.title}</h4>
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
                        className="text-sm text-on-dark-muted transition-colors hover:text-aqua"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        className="text-sm text-on-dark-muted transition-colors hover:text-aqua"
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

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-on-dark-muted">© 2026 OptiGo. All rights reserved.</p>
          <p className="text-xs text-on-dark-muted">Connecting every practice to every lab.</p>
        </div>
      </div>
    </footer>
  );
}
