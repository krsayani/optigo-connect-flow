import { useState, type ComponentType } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronDown,
  Ellipsis,
  LayoutList,
  LogOut,
  MessageSquare,
  Plus,
  ScrollText,
  Search,
  Settings,
} from "lucide-react";
import { signOut } from "@/lib/auth/functions";
import { LensConfigProvider, useLensConfig } from "@/components/lens-config/provider";
import { LensLabConfiguration } from "@/components/lens-config/lens-lab-configuration";
import { OrderComposer } from "@/components/lens-config/order-composer";
import { LensesIcon } from "@/components/site/lenses-icon";
import { OptiGoMark } from "@/components/site/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import "./lensflow.css";

const COLUMNS = [
  "Created",
  "Lens Ordered",
  "In Production",
  "On Hold",
  "Edging Completed",
  "Ready for Pick Up",
  "Dispensed",
] as const;

const TABS = [
  { id: "jobs", label: "Orders", icon: LayoutList },
  { id: "register", label: "New order", icon: Plus },
  { id: "config", label: "Lens config", icon: LensesIcon },
  { id: "dashboard", label: "KPIs", icon: BarChart3 },
  { id: "comments", label: "Comments", icon: MessageSquare },
  { id: "log", label: "Log", icon: ScrollText },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

const MOBILE_PRIMARY: TabId[] = ["jobs", "register", "config"];
const MORE_TABS = TABS.filter((item) => !MOBILE_PRIMARY.includes(item.id));

const EMPTY: Record<
  Exclude<TabId, "jobs" | "register" | "config" | "log">,
  { kicker: string; title: string; body: string }
> = {
  dashboard: {
    kicker: "Practice",
    title: "KPIs",
    body: "Performance metrics will appear here as orders move through the lab.",
  },
  comments: {
    kicker: "Inbox",
    title: "Comments",
    body: "Lab and practice threads will land here, tied to each order.",
  },
  settings: {
    kicker: "Account",
    title: "Settings",
    body: "Lens and lab configuration lives under Lens config.",
  },
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "OG";
}

export function LensFlowApp({ displayName }: { displayName: string }) {
  return (
    <LensConfigProvider>
      <AppShellInner displayName={displayName} />
    </LensConfigProvider>
  );
}

function AppShellInner({ displayName }: { displayName: string }) {
  const navigate = useNavigate();
  const { db, storage } = useLensConfig();
  const [tab, setTab] = useState<TabId>("jobs");
  const [query, setQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  async function signOutUser() {
    try {
      await signOut();
    } finally {
      void navigate({ to: "/login" });
    }
  }

  const orders = db.orders;
  const lifetime = orders.length;
  const inFlow = orders.filter((order) => order.status !== "manual_review").length;
  const storageLabel =
    storage === "cloud" ? "OptiGo Cloud" : storage === "loading" ? "Connecting…" : "This device";
  const moreActive = MORE_TABS.some((item) => item.id === tab);

  return (
    <div className="lf-app font-sans">
      <aside className="hidden w-[13.5rem] shrink-0 flex-col bg-sidebar px-3 py-4 md:flex">
        <div className="flex items-center gap-2 px-2 pb-6">
          <OptiGoMark className="h-7 w-7" />
          <span className="font-display text-[1.05rem] font-extrabold tracking-[-0.04em] text-sidebar-foreground">
            Opti<span className="text-electric-soft">Go</span>
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5" aria-label="OptiGo">
          {TABS.map((item) => (
            <NavButton
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={tab === item.id}
              onSelect={() => setTab(item.id)}
              variant="sidebar"
            />
          ))}
        </nav>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-aqua">
            Workspace
          </p>
          <p className="mt-1 text-[11px] leading-snug text-sidebar-foreground/65">
            Catalog and orders save to {storageLabel}.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-hairline bg-background/80 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur-xl sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-2 md:hidden">
              <OptiGoMark className="h-7 w-7 shrink-0" />
              <span className="font-display text-lg font-extrabold tracking-[-0.04em] text-navy">
                Opti<span className="text-electric">Go</span>
              </span>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <FilterChip live>All locations</FilterChip>
              <FilterChip>All lens types</FilterChip>
              <FilterChip>Any due</FilterChip>
            </div>

            <div className="hidden min-w-0 flex-1 md:flex">
              <SearchField query={query} onQuery={setQuery} />
            </div>

            <span
              className="hidden rounded-full bg-navy px-3 py-1.5 font-display text-[12px] font-extrabold tabular-nums text-primary-foreground sm:inline-flex"
              title={`${lifetime} lifetime orders`}
            >
              {lifetime} lifetime
            </span>
            <span
              className="hidden rounded-full border border-electric/25 bg-electric/10 px-3 py-1.5 font-display text-[12px] font-extrabold tabular-nums text-electric sm:inline-flex"
              title={`${inFlow} orders in flow`}
            >
              {inFlow} in flow
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2.5 text-left shadow-sm outline-none transition-colors hover:border-electric/35 focus-visible:ring-2 focus-visible:ring-electric md:min-h-0"
                  aria-label="Account menu"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-navy font-display text-[11px] font-bold text-primary-foreground md:h-7 md:w-7">
                    {initials(displayName)}
                  </span>
                  <span className="hidden max-w-[140px] truncate text-[13px] font-semibold text-navy sm:inline">
                    {displayName}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-semibold text-navy">{displayName}</p>
                  <p className="text-xs font-normal text-muted-foreground">{storageLabel}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOutUser()}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-2 md:hidden">
            <SearchField query={query} onQuery={setQuery} />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {tab === "jobs" ? (
            <OrderBoard query={query} />
          ) : tab === "register" ? (
            <OrderComposer />
          ) : tab === "config" ? (
            <LensLabConfiguration />
          ) : tab === "log" ? (
            <AuditLogPanel />
          ) : (
            <EmptyWorkspace
              kicker={EMPTY[tab].kicker}
              title={EMPTY[tab].title}
              body={
                tab === "settings"
                  ? storage === "cloud"
                    ? "Workspace catalog, labs, and orders are saved to OptiGo Cloud."
                    : storage === "loading"
                      ? "Connecting to OptiGo Cloud…"
                      : "Workspace data is stored on this device until Cloud is connected."
                  : EMPTY[tab].body
              }
            />
          )}
        </main>

        <nav
          className="grid grid-cols-4 gap-1 border-t border-hairline bg-background/95 px-2 py-1 pb-[max(0.45rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
          aria-label="OptiGo"
        >
          {TABS.filter((item) => MOBILE_PRIMARY.includes(item.id)).map((item) => (
            <NavButton
              key={item.id}
              label={item.id === "register" ? "New" : item.id === "config" ? "Config" : item.label}
              icon={item.icon}
              active={tab === item.id}
              onSelect={() => setTab(item.id)}
              variant="mobile"
            />
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold",
              moreActive ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <Ellipsis className="h-4 w-4" />
            More
          </button>
        </nav>

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl pb-[max(1.25rem,env(safe-area-inset-bottom))] md:hidden"
          >
            <SheetHeader>
              <SheetTitle className="font-display text-navy">More</SheetTitle>
            </SheetHeader>
            <div className="mt-3 grid gap-1">
              {MORE_TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTab(item.id);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold",
                    tab === item.id
                      ? "bg-navy text-primary-foreground"
                      : "text-navy hover:bg-mist",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function SearchField({
  query,
  onQuery,
}: {
  query: string;
  onQuery: (value: string) => void;
}) {
  return (
    <form
      className="flex h-11 min-w-0 w-full items-center gap-2 rounded-xl border border-border bg-mist/70 px-3 md:h-9 md:max-w-md"
      onSubmit={(e) => e.preventDefault()}
      autoComplete="off"
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        name="optigo_search"
        type="search"
        placeholder="Search names, tray, UPC…"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base text-navy outline-none placeholder:text-muted-foreground md:text-[13px]"
      />
    </form>
  );
}

function NavButton({
  label,
  icon: Icon,
  active,
  onSelect,
  variant,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  onSelect: () => void;
  variant: "sidebar" | "mobile";
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2.5 text-left text-[13px] font-medium transition-colors",
        variant === "sidebar" &&
          cn(
            "w-full rounded-lg px-2.5 py-2",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60",
          ),
        variant === "mobile" &&
          cn(
            "min-h-[3.25rem] min-w-0 flex-col justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold",
            active ? "bg-navy text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          ),
      )}
    >
      <Icon className={variant === "mobile" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      {label}
    </button>
  );
}

function FilterChip({ children, live }: { children: string; live?: boolean }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[12.5px] font-semibold text-navy shadow-sm"
      aria-label={children}
    >
      {live ? (
        <span className="h-1.5 w-1.5 rounded-full bg-aqua shadow-[0_0_0_3px_color-mix(in_oklab,var(--aqua)_28%,transparent)]" />
      ) : null}
      {children}
      <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
    </button>
  );
}

function EmptyWorkspace({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <div className="lf-module">
      <div className="lf-page-head">
        <div className="lf-page-kicker">{kicker}</div>
        <div className="lf-page-title">{title}</div>
      </div>
      <div className="lf-empty-panel">{body}</div>
    </div>
  );
}

function OrderBoard({ query }: { query: string }) {
  const { db } = useLensConfig();
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? db.orders.filter((order) => {
        const hay = `${order.snapshot.readableSummary} ${order.snapshot.labName} ${order.status}`;
        return hay.toLowerCase().includes(needle);
      })
    : db.orders;

  const byColumn: Record<(typeof COLUMNS)[number], typeof db.orders> = {
    Created: visible.filter(
      (order) => order.status === "manual_review" || order.status === "created",
    ),
    "Lens Ordered": visible.filter((order) => order.status === "routed"),
    "In Production": [],
    "On Hold": [],
    "Edging Completed": [],
    "Ready for Pick Up": [],
    Dispensed: [],
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="lf-page-head">
        <div className="lf-page-kicker">Practice workspace</div>
        <div className="lf-page-title">Orders</div>
      </div>
      <div className="lf-board-wrap">
        {COLUMNS.map((label) => {
          const cards = byColumn[label];
          return (
            <section key={label} className="lf-board-col">
              <div className="lf-col-head">
                <span className="lf-col-title">{label}</span>
                <span className="lf-col-count">{cards.length}</span>
              </div>
              {cards.length === 0 ? (
                <div className="lf-col-empty">No orders</div>
              ) : (
                <div className="lf-col-cards">
                  {cards.map((order) => (
                    <article key={order.id} className="lf-order-card">
                      <div className="lf-order-card-title">{order.snapshot.readableSummary}</div>
                      <div className="lf-order-card-meta">
                        {order.snapshot.labName}
                        {order.status === "manual_review" ? " · needs review" : ""}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function AuditLogPanel() {
  const { db } = useLensConfig();
  return (
    <div className="lf-module">
      <div className="lf-page-head">
        <div className="lf-page-kicker">Activity</div>
        <div className="lf-page-title">Configuration audit log</div>
      </div>
      {db.auditLog.length === 0 ? (
        <div className="lf-empty-panel">No activity yet.</div>
      ) : (
        <ul className="space-y-2 p-5 sm:p-7">
          {db.auditLog.slice(0, 50).map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-card"
            >
              <div className="font-semibold text-navy">
                {row.action} · {row.entityType}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {row.entityId} · {new Date(row.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
