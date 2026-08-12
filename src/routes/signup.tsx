import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, FlaskConical, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";
import { SignupForm, type SignupAccountType } from "@/components/site/forms";
import { Section } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const TITLE = "Sign Up | OptiGo for Practices & Labs";
const DESC =
  "Create your OptiGo account as an optometry practice or optical laboratory and start connecting optical workflows.";

type SignupSearch = {
  type?: SignupAccountType;
};

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignupSearch => {
    const type = search.type;
    if (type === "practice" || type === "lab") return { type };
    return {};
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/signup" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: SignupPage,
});

const practicePerks = [
  "Centralize optical orders across locations",
  "Cut repetitive data entry and status chasing",
  "Give patients clearer order visibility",
];

const labPerks = [
  "Receive structured digital order handoffs",
  "Reduce repetitive status inquiries",
  "Connect once to practices on OptiGo",
];

function SignupPage() {
  const search = Route.useSearch();
  const [accountType, setAccountType] = useState<SignupAccountType | null>(
    search.type ?? null,
  );

  useEffect(() => {
    if (search.type) setAccountType(search.type);
  }, [search.type]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
        <div className="absolute inset-0 surface-aurora" />
        <div className="absolute inset-0 grid-mesh opacity-40" />
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-electric/20 blur-3xl animate-orb" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-aqua/20 blur-3xl animate-orb" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal className="max-w-3xl">
            <p className="eyebrow text-electric">Get started</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] text-navy sm:text-5xl lg:text-[3.5rem]">
              Sign up for <span className="text-gradient">OptiGo</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Choose your path — optometry practice or optical laboratory — and create your
              account to join the connected optical workflow.
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-12 sm:!pt-16">
        {!accountType ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <AccountChoice
              tone="practice"
              icon={<Building2 className="h-5 w-5" />}
              title="Optometry practice"
              body="For clinics and multi-location groups that want one place for optical orders, labs, and patient updates."
              perks={practicePerks}
              cta="Continue as a practice"
              onSelect={() => setAccountType("practice")}
            />
            <AccountChoice
              tone="lab"
              icon={<FlaskConical className="h-5 w-5" />}
              title="Optical laboratory"
              body="For labs that want cleaner digital handoffs, fewer status calls, and a modern connection to practices."
              perks={labPerks}
              cta="Continue as a lab"
              onSelect={() => setAccountType("lab")}
              delay={100}
            />
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <Reveal className="glass-panel rounded-3xl p-6 sm:p-9">
              <SignupForm
                accountType={accountType}
                onChangeType={() => setAccountType(null)}
              />
            </Reveal>
            <Reveal delay={120} className="space-y-4">
              <div className="rounded-3xl border border-border bg-mist p-6 sm:p-7">
                <p className="eyebrow">What happens next</p>
                <ul className="mt-5 space-y-4">
                  {[
                    "We review your organization details",
                    "You get activation steps by email",
                    "We help connect your systems and labs",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-navy">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-electric/20 surface-dark p-6 sm:p-7">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-aqua">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-on-dark">Built for trust</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                  Please do not include patient health information. OptiGo is being built with
                  security and healthcare data stewardship in mind.
                </p>
                <p className="mt-5 text-xs text-on-dark-muted">
                  Prefer a walkthrough first?{" "}
                  <Link to="/demo" className="font-semibold text-aqua hover:underline">
                    Request a demo
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
        )}
      </Section>
    </>
  );
}

function AccountChoice({
  tone,
  icon,
  title,
  body,
  perks,
  cta,
  onSelect,
  delay = 0,
}: {
  tone: "practice" | "lab";
  icon: ReactNode;
  title: string;
  body: string;
  perks: string[];
  cta: string;
  onSelect: () => void;
  delay?: number;
}) {
  const isLab = tone === "lab";

  return (
    <Reveal delay={delay}>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border p-7 text-left transition-all duration-300 sm:p-9",
          "hover:-translate-y-1 hover:shadow-float focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric/20",
          isLab
            ? "border-electric/25 surface-dark"
            : "border-border bg-background shadow-card hover:border-electric/35",
        )}
      >
        {isLab && <div className="absolute inset-0 grid-mesh-dark opacity-50" />}
        <div className="relative flex flex-1 flex-col">
          <span
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-2xl",
              isLab ? "bg-white/10 text-aqua" : "bg-accent text-electric",
            )}
          >
            {icon}
          </span>
          <h2
            className={cn(
              "mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl",
              isLab ? "text-on-dark" : "text-navy",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed",
              isLab ? "text-on-dark-muted" : "text-muted-foreground",
            )}
          >
            {body}
          </p>
          <ul className="mt-6 space-y-2.5">
            {perks.map((perk) => (
              <li
                key={perk}
                className={cn(
                  "flex items-start gap-2.5 text-sm",
                  isLab ? "text-on-dark/90" : "text-navy/85",
                )}
              >
                <CheckCircle2
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    isLab ? "text-aqua" : "text-electric",
                  )}
                />
                {perk}
              </li>
            ))}
          </ul>
          <span
            className={cn(
              "mt-8 inline-flex items-center gap-2 text-sm font-semibold",
              isLab ? "text-aqua" : "text-electric",
            )}
          >
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </button>
    </Reveal>
  );
}
