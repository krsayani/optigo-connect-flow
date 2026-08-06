import { useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  Cable,
  FlaskConical,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  Clock,
  CircleAlert,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebar = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Orders", icon: Building2, active: true },
  { label: "Labs", icon: FlaskConical },
  { label: "Patients", icon: Users },
  { label: "Integrations", icon: Cable },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const filters = ["All", "In Progress", "Completed", "Flagged", "Delayed"] as const;

type Status =
  | "Submitted"
  | "Order Review"
  | "Lens Ordered"
  | "In Production"
  | "Surfacing"
  | "Coating"
  | "Quality Inspection"
  | "Shipped"
  | "Ready for Pickup";

const statusTone: Record<Status, string> = {
  Submitted: "bg-muted text-muted-foreground border-border",
  "Order Review": "bg-accent text-navy border-electric/20",
  "Lens Ordered": "bg-accent text-navy border-electric/20",
  "In Production": "bg-electric/10 text-electric border-electric/25",
  Surfacing: "bg-electric/10 text-electric border-electric/25",
  Coating: "bg-electric/10 text-electric border-electric/25",
  "Quality Inspection": "bg-aqua/15 text-navy border-aqua/40",
  Shipped: "bg-aqua/15 text-navy border-aqua/40",
  "Ready for Pickup": "bg-navy text-on-dark border-navy",
};

const orders: {
  patient: string;
  id: string;
  lab: string;
  submitted: string;
  status: Status;
  eta: string;
  flag?: "delayed" | "attention";
}[] = [
  {
    patient: "Demo Patient — A. Rivera",
    id: "OG-24817",
    lab: "Northline Optical Lab",
    submitted: "Mar 4",
    status: "In Production",
    eta: "Mar 11",
  },
  {
    patient: "Demo Patient — J. Whitfield",
    id: "OG-24812",
    lab: "Crescent Lens Works",
    submitted: "Mar 4",
    status: "Surfacing",
    eta: "Mar 12",
  },
  {
    patient: "Demo Patient — M. Osei",
    id: "OG-24806",
    lab: "Northline Optical Lab",
    submitted: "Mar 3",
    status: "Quality Inspection",
    eta: "Mar 9",
  },
  {
    patient: "Demo Patient — L. Tanaka",
    id: "OG-24799",
    lab: "Meridian Optical",
    submitted: "Mar 2",
    status: "Coating",
    eta: "Mar 10",
    flag: "attention",
  },
  {
    patient: "Demo Patient — S. Brennan",
    id: "OG-24791",
    lab: "Crescent Lens Works",
    submitted: "Mar 1",
    status: "Shipped",
    eta: "Mar 7",
  },
  {
    patient: "Demo Patient — D. Kaur",
    id: "OG-24784",
    lab: "Meridian Optical",
    submitted: "Feb 28",
    status: "Ready for Pickup",
    eta: "Ready",
  },
  {
    patient: "Demo Patient — P. Alvarez",
    id: "OG-24777",
    lab: "Northline Optical Lab",
    submitted: "Feb 27",
    status: "Order Review",
    eta: "Mar 13",
    flag: "delayed",
  },
];

const stats = [
  { label: "Active Orders", value: "148", delta: "+12 this week", icon: Activity },
  { label: "Completed", value: "1,092", delta: "Last 90 days", icon: CheckCircle2 },
  { label: "Average Turnaround", value: "6.4 days", delta: "−0.8 vs. prior", icon: Clock },
  { label: "Requiring Attention", value: "5", delta: "3 delayed · 2 flagged", icon: CircleAlert },
];

export function DashboardMockup() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [pulseRow, setPulseRow] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulseRow((v) => (v + 1) % orders.length), 2200);
    return () => clearInterval(t);
  }, []);

  const visible = orders.filter((o) => {
    if (filter === "All") return true;
    if (filter === "Completed") return o.status === "Ready for Pickup" || o.status === "Shipped";
    if (filter === "Flagged") return o.flag === "attention";
    if (filter === "Delayed") return o.flag === "delayed";
    return o.status !== "Ready for Pickup";
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-float">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-mist px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="mx-auto rounded-md bg-background px-3 py-1 font-mono text-[10px] text-muted-foreground">
          app.optigo.io/orders
        </span>
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className="hidden w-52 shrink-0 flex-col bg-sidebar px-3 py-4 md:flex">
          <div className="flex items-center gap-2 px-2 pb-5">
            <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-electric to-aqua" />
            <span className="font-display text-sm font-bold text-sidebar-foreground">
              OptiGo
            </span>
          </div>
          <nav className="space-y-0.5">
            {sidebar.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-aqua">
              Demo data
            </p>
            <p className="mt-1 text-[11px] leading-snug text-sidebar-foreground/60">
              All records shown are fictional examples.
            </p>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1 bg-background">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 sm:px-6">
            <div>
              <h3 className="text-sm font-semibold text-navy sm:text-base">Order Overview</h3>
              <p className="text-[11px] text-muted-foreground">
                Riverbend Eyecare · 3 locations
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 sm:flex">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">Search orders</span>
            </div>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-3 border-b border-border px-4 py-4 sm:px-6 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-mist/60 p-3 transition-transform duration-500 hover:-translate-y-0.5"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <s.icon className="h-3.5 w-3.5 text-electric" />
                </div>
                <p className="mt-1.5 font-display text-xl font-bold text-navy">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.delta}</p>
              </div>
            ))}
          </div>

          {/* filters */}
          <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 sm:px-6">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                  filter === f
                    ? "bg-navy text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* table */}
          <div className="overflow-x-auto px-1 pb-5 sm:px-3">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 font-semibold">Patient</th>
                  <th className="px-3 py-2 font-semibold">Order #</th>
                  <th className="px-3 py-2 font-semibold">Laboratory</th>
                  <th className="px-3 py-2 font-semibold">Submitted</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Est. Completion</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((o) => {
                  const live = orders[pulseRow]?.id === o.id;
                  return (
                    <tr
                      key={o.id}
                      className={cn(
                        "border-t border-border/70 transition-colors",
                        live ? "bg-accent/50" : "hover:bg-muted/50",
                      )}
                    >
                      <td className="px-3 py-3 text-[12.5px] font-medium text-navy">
                        <span className="flex items-center gap-2">
                          {live && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric animate-pulse-soft" />
                          )}
                          {o.patient}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono text-[11.5px] text-muted-foreground">
                        {o.id}
                      </td>
                      <td className="px-3 py-3 text-[12.5px] text-navy/80">{o.lab}</td>
                      <td className="px-3 py-3 text-[12px] text-muted-foreground">
                        {o.submitted}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
                            statusTone[o.status],
                          )}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-muted-foreground">
                        {o.eta}
                        {o.flag === "delayed" && (
                          <span className="ml-2 rounded-md bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                            Delayed
                          </span>
                        )}
                        {o.flag === "attention" && (
                          <span className="ml-2 rounded-md bg-chart-5/25 px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                            Flagged
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
