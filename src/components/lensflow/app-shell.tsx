import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { demoLogout, DEMO_USERNAME } from "@/lib/demo-auth";
import { LensConfigProvider, useLensConfig } from "@/components/lens-config/provider";
import { LensLabConfiguration } from "@/components/lens-config/lens-lab-configuration";
import { OrderComposer } from "@/components/lens-config/order-composer";
import "./lensflow.css";

const COLUMNS = [
  "Created",
  "Lens Ordered",
  "In Production",
  "On Hold",
  "Edging Completed",
  "Ready for Pick Up (PP)",
  "Ready for Pick Up (CV)",
  "Ready for Pick Up (SV)",
  "Dispensed",
] as const;

const TABS = [
  { id: "jobs", label: "Orders", icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  { id: "register", label: "New order", icon: "M12 5v14M5 12h14" },
  { id: "config", label: "Lens config", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
  { id: "dashboard", label: "KPIs", icon: "M3 3v18h18M7 15v-4M12 15V8M17 15v-7" },
  {
    id: "comments",
    label: "Comments",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
  { id: "log", label: "Log", icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" },
  {
    id: "settings",
    label: "Settings",
    icon: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const EMPTY: Record<
  Exclude<TabId, "jobs" | "register" | "config" | "log">,
  { kicker: string; title: string; body: string }
> = {
  dashboard: { kicker: "Practice", title: "KPIs", body: "No performance data yet." },
  comments: { kicker: "Inbox", title: "Comments", body: "No comments yet." },
  settings: {
    kicker: "Account",
    title: "Settings",
    body: "Demo workspace — lens and lab configuration lives under Lens config.",
  },
};

export function LensFlowApp() {
  return (
    <LensConfigProvider>
      <AppShellInner />
    </LensConfigProvider>
  );
}

function AppShellInner() {
  const navigate = useNavigate();
  const { db, storage } = useLensConfig();
  const [tab, setTab] = useState<TabId>("jobs");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest(".lf-header-actions")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function signOut() {
    demoLogout();
    void navigate({ to: "/login" });
  }

  const orders = db.orders;
  const lifetime = orders.length;
  const inFlow = orders.filter((order) => order.status !== "manual_review").length;

  return (
    <div className="lf-app">
      <header className="lf-header">
        <div className="lf-brand" title="OptiGo">
          <span className="lf-brand-name">OptiGo</span>
        </div>
        <div className="lf-filters">
          <button type="button" className="lf-chip" aria-label="Change location">
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: "var(--gto-live)",
                flex: "none",
              }}
            />
            <span>All locations</span>
            <span style={{ color: "var(--color-neutral-600)", fontSize: 10, flex: "none" }}>⌄</span>
          </button>
          <button type="button" className="lf-chip" aria-label="Filter by lens type">
            <span>All lens types</span>
            <span style={{ color: "var(--color-neutral-600)", fontSize: 10, flex: "none" }}>⌄</span>
          </button>
          <button type="button" className="lf-chip" aria-label="Filter by due date">
            <span>Any due</span>
            <span style={{ color: "var(--color-neutral-600)", fontSize: 10, flex: "none" }}>⌄</span>
          </button>
        </div>
        <form className="lf-search" onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="var(--color-neutral-600)"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>
          <input
            name="goto_search"
            type="text"
            placeholder="Search names, tray, UPC…"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
        <span className="lf-count is-dark" title={`${lifetime} lifetime orders`}>
          {lifetime} lifetime
        </span>
        <span className="lf-count" title={`${inFlow} orders in flow`}>
          {inFlow} in flow
        </span>
        <div className="lf-header-actions">
          <button
            type="button"
            className="lf-chip"
            aria-label="Account menu"
            title="Account"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span>{DEMO_USERNAME}</span>
            <span style={{ color: "var(--color-neutral-600)", fontSize: 10, flex: "none" }}>⌄</span>
          </button>
          {menuOpen && (
            <div className="lf-account-menu">
              <button type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="lf-body">
        <nav className="lf-nav" aria-label="OptiGo">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "lf-nav-btn is-on" : "lf-nav-btn"}
              onClick={() => setTab(t.id)}
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={t.icon} />
              </svg>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <main className="lf-main">
          {tab === "jobs" ? (
            <OrderBoard />
          ) : tab === "register" ? (
            <OrderComposer />
          ) : tab === "config" ? (
            <LensLabConfiguration />
          ) : tab === "log" ? (
            <AuditLogPanel />
          ) : (
            <>
              <div className="lf-page-head">
                <div className="lf-page-kicker">{EMPTY[tab].kicker}</div>
                <div className="lf-page-title">{EMPTY[tab].title}</div>
              </div>
              <div className="lf-empty-panel">
                {tab === "settings"
                  ? storage === "cloud"
                    ? "Workspace catalog, labs, and orders are saved to OptiGo Cloud."
                    : storage === "loading"
                      ? "Connecting to OptiGo Cloud…"
                      : "Workspace data is stored on this device until Cloud is connected."
                  : EMPTY[tab].body}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function OrderBoard() {
  const { db } = useLensConfig();
  const byColumn: Record<(typeof COLUMNS)[number], typeof db.orders> = {
    Created: db.orders.filter(
      (order) => order.status === "manual_review" || order.status === "created",
    ),
    "Lens Ordered": db.orders.filter((order) => order.status === "routed"),
    "In Production": [],
    "On Hold": [],
    "Edging Completed": [],
    "Ready for Pick Up (PP)": [],
    "Ready for Pick Up (CV)": [],
    "Ready for Pick Up (SV)": [],
    Dispensed: [],
  };

  return (
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
        <ul className="space-y-2 p-5">
          {db.auditLog.slice(0, 50).map((row) => (
            <li key={row.id} className="rounded-xl border bg-background px-4 py-3 text-sm">
              <div className="font-medium">
                {row.action} · {row.entityType}
              </div>
              <div className="text-xs text-muted-foreground">
                {row.entityId} · {new Date(row.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
