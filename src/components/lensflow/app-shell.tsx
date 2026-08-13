import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { demoLogout, DEMO_USERNAME } from "@/lib/demo-auth";
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
];

const TABS = [
  { id: "jobs", label: "Orders", icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
  { id: "register", label: "New card", icon: "M12 5v14M5 12h14" },
  { id: "dashboard", label: "KPIs", icon: "M3 3v18h18M7 15v-4M12 15V8M17 15v-7" },
  { id: "comments", label: "Comments", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { id: "log", label: "Log", icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2" },
  { id: "settings", label: "Settings", icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.6.65 1.03 1.27 1.05H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const EMPTY: Record<Exclude<TabId, "jobs">, { kicker: string; title: string; body: string }> = {
  register: { kicker: "New card", title: "New card", body: "No orders to create from yet." },
  dashboard: { kicker: "Practice", title: "KPIs", body: "No performance data yet." },
  comments: { kicker: "Inbox", title: "Comments", body: "No comments yet." },
  log: { kicker: "Activity", title: "Log", body: "No activity yet." },
  settings: { kicker: "Account", title: "Settings", body: "Demo workspace — no lab data is loaded." },
};

export function LensFlowApp() {
  const navigate = useNavigate();
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

  return (
    <div className="lf-app">
      <header className="lf-header">
        <div className="lf-brand" title="LensFlow">
          <img src="/goto-logo.png" alt="" aria-hidden="true" />
          <span className="lf-brand-name">LensFlow</span>
        </div>
        <div className="lf-filters">
          <button type="button" className="lf-chip" aria-label="Change location">
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--gto-live)", flex: "none" }} />
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
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--color-neutral-600)" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>
          <input name="goto_search" type="text" placeholder="Search names, tray, UPC…" autoComplete="off" spellCheck={false} />
        </form>
        <span className="lf-count is-dark" title="0 lifetime orders">0 lifetime</span>
        <span className="lf-count" title="0 orders in flow">0 in flow</span>
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
        <nav className="lf-nav" aria-label="LensFlow">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "lf-nav-btn is-on" : "lf-nav-btn"}
              onClick={() => setTab(t.id)}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d={t.icon} />
              </svg>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <main className="lf-main">
          {tab === "jobs" ? (
            <div className="lf-board-wrap">
              {COLUMNS.map((label) => (
                <section key={label} className="lf-board-col">
                  <div className="lf-col-head">
                    <span className="lf-col-title">{label}</span>
                    <span className="lf-col-count">0</span>
                  </div>
                  <div className="lf-col-empty">No orders</div>
                </section>
              ))}
            </div>
          ) : (
            <>
              <div className="lf-page-head">
                <div className="lf-page-kicker">{EMPTY[tab].kicker}</div>
                <div className="lf-page-title">{EMPTY[tab].title}</div>
              </div>
              <div className="lf-empty-panel">{EMPTY[tab].body}</div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
