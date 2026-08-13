import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  BarChart3,
  Building2,
  Cable,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Search,
  Clock,
  CircleAlert,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LensesIcon } from "@/components/site/lenses-icon";

type ViewId =
  | "Overview"
  | "Orders"
  | "Messages"
  | "LMS"
  | "Payments"
  | "Integrations"
  | "Analytics";

const sidebar: { id: ViewId; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "Overview", label: "Overview", icon: LayoutDashboard },
  { id: "Orders", label: "Orders", icon: Building2 },
  { id: "Messages", label: "Messages", icon: MessageSquare },
  { id: "LMS", label: "LMS", icon: LensesIcon },
  { id: "Payments", label: "Payments", icon: CreditCard },
  { id: "Analytics", label: "Analytics", icon: BarChart3 },
  { id: "Integrations", label: "Integrations", icon: Cable },
];

const viewPaths: Record<ViewId, string> = {
  Overview: "app.optigo.io/overview",
  Orders: "app.optigo.io/orders",
  Messages: "app.optigo.io/messages",
  LMS: "app.optigo.io/lms",
  Payments: "app.optigo.io/payments",
  Analytics: "app.optigo.io/analytics",
  Integrations: "app.optigo.io/integrations",
};

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

const orderStats = [
  { label: "Active Orders", value: "148", delta: "+12 this week", icon: Activity },
  { label: "Completed", value: "1,092", delta: "Last 90 days", icon: CheckCircle2 },
  { label: "Average Turnaround", value: "6.4 days", delta: "−0.8 vs. prior", icon: Clock },
  { label: "Requiring Attention", value: "5", delta: "3 delayed · 2 flagged", icon: CircleAlert },
];

const labs = [
  {
    name: "Northline Optical Lab",
    lms: "Northline LMS",
    orders: 62,
    turnaround: "5.8 days",
    onTime: "96%",
    remakes: "1.2%",
    status: "Connected",
  },
  {
    name: "Crescent Lens Works",
    lms: "Crescent Hub",
    orders: 41,
    turnaround: "6.1 days",
    onTime: "94%",
    remakes: "1.8%",
    status: "Connected",
  },
  {
    name: "Meridian Optical",
    lms: "Meridian LMS",
    orders: 28,
    turnaround: "7.4 days",
    onTime: "88%",
    remakes: "2.9%",
    status: "Connected",
  },
  {
    name: "Summit Precision Lab",
    lms: "Summit Portal",
    orders: 17,
    turnaround: "6.9 days",
    onTime: "91%",
    remakes: "2.1%",
    status: "Pending",
  },
];

const integrations = [
  { name: "Crystal Practice Management", type: "PMS", status: "Connected", sync: "2 min ago" },
  { name: "Ocuco", type: "PMS", status: "In development", sync: "—" },
  { name: "DVI", type: "PMS", status: "In development", sync: "—" },
  { name: "Northline LMS", type: "LMS", status: "Connected", sync: "1 min ago" },
  { name: "Crescent Hub", type: "LMS", status: "Connected", sync: "4 min ago" },
  { name: "Meridian LMS", type: "LMS", status: "Connected", sync: "8 min ago" },
];

const analytics = [
  { label: "Lab spend (90d)", value: "$84.2k", change: "+4.1%", up: true },
  { label: "Avg cost / order", value: "$77", change: "−3.2%", up: false },
  { label: "On-time rate", value: "93%", change: "+1.8%", up: true },
  { label: "Routing savings", value: "$6.4k", change: "+12%", up: true },
];

const bars = [
  { lab: "Northline", pct: 88 },
  { lab: "Crescent", pct: 74 },
  { lab: "Meridian", pct: 61 },
  { lab: "Summit", pct: 42 },
];

function PanelHeader({
  title,
  subtitle,
  searchPlaceholder,
}: {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5 sm:px-6">
      <div>
        <h3 className="text-sm font-semibold text-navy sm:text-base">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      <div className="hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 sm:flex">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">{searchPlaceholder}</span>
      </div>
    </div>
  );
}

function StatGrid({
  items,
}: {
  items: {
    label: string;
    value: string;
    delta: string;
    icon: ComponentType<{ className?: string }>;
  }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 border-b border-border px-4 py-4 sm:px-6 lg:grid-cols-4">
      {items.map((s, i) => (
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
  );
}

function OrdersView() {
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
    <>
      <PanelHeader
        title="Order Overview"
        subtitle="Riverbend Eyecare · 3 locations"
        searchPlaceholder="Search orders"
      />
      <StatGrid items={orderStats} />
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
                  <td className="px-3 py-3 text-[12px] text-muted-foreground">{o.submitted}</td>
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
    </>
  );
}

function OverviewView({ onOpen }: { onOpen: (id: ViewId) => void }) {
  return (
    <>
      <PanelHeader
        title="Practice Overview"
        subtitle="Riverbend Eyecare · PMS connected"
        searchPlaceholder="Search"
      />
      <StatGrid items={orderStats} />
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        {[
          {
            id: "Orders" as const,
            title: "Active orders",
            body: "148 in flight across 3 locations. 5 need attention.",
          },
          {
            id: "Messages" as const,
            title: "Lab & patient threads",
            body: "4 unread. One platform to talk with labs and patients.",
          },
          {
            id: "Payments" as const,
            title: "Payments",
            body: "$12.4k outstanding. Invoices and lab spend in one view.",
          },
          {
            id: "Analytics" as const,
            title: "Lab intelligence",
            body: "93% on-time. $6.4k saved via optimized LMS selection.",
          },
        ].map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onOpen(card.id)}
            className="rounded-2xl border border-border bg-mist/50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-electric/30 hover:shadow-card"
          >
            <p className="text-sm font-semibold text-navy">{card.title}</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{card.body}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-electric">
              Open {card.id}
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function LabsView() {
  return (
    <>
      <PanelHeader
        title="Lab Management Systems"
        subtitle="Connected LMS partners · demo network"
        searchPlaceholder="Search LMS"
      />
      <StatGrid
        items={[
          { label: "Connected LMS", value: "3", delta: "1 pending", icon: LensesIcon },
          { label: "Orders routed", value: "148", delta: "This week", icon: Activity },
          { label: "Best turnaround", value: "5.8d", delta: "Northline", icon: Clock },
          { label: "Avg on-time", value: "93%", delta: "+1.8% vs prior", icon: CheckCircle2 },
        ]}
      />
      <div className="overflow-x-auto px-1 pb-5 sm:px-3">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-semibold">Laboratory</th>
              <th className="px-3 py-2 font-semibold">LMS</th>
              <th className="px-3 py-2 font-semibold">Active orders</th>
              <th className="px-3 py-2 font-semibold">Turnaround</th>
              <th className="px-3 py-2 font-semibold">On-time</th>
              <th className="px-3 py-2 font-semibold">Remakes</th>
              <th className="px-3 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr key={lab.name} className="border-t border-border/70 hover:bg-muted/50">
                <td className="px-3 py-3 text-[12.5px] font-medium text-navy">{lab.name}</td>
                <td className="px-3 py-3 text-[12px] text-muted-foreground">{lab.lms}</td>
                <td className="px-3 py-3 text-[12.5px] text-navy">{lab.orders}</td>
                <td className="px-3 py-3 text-[12px] text-muted-foreground">{lab.turnaround}</td>
                <td className="px-3 py-3 text-[12px] font-semibold text-electric">{lab.onTime}</td>
                <td className="px-3 py-3 text-[12px] text-muted-foreground">{lab.remakes}</td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
                      lab.status === "Connected"
                        ? "border-electric/25 bg-electric/10 text-electric"
                        : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {lab.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MessagesView() {
  const threads = [
    {
      order: "OG-24817",
      with: "Northline Optical Lab",
      role: "Lab",
      preview: "Confirm AR coating on this job before coating starts?",
      time: "12m",
      unread: true,
    },
    {
      order: "OG-24799",
      with: "L. Tanaka",
      role: "Patient",
      preview: "Your lenses are in coating — we’ll text when they’re ready.",
      time: "38m",
      unread: true,
    },
    {
      order: "OG-24777",
      with: "Meridian Optical",
      role: "Lab",
      preview: "Delay on blank stock. New ETA March 13.",
      time: "2h",
      unread: true,
    },
    {
      order: "OG-24784",
      with: "D. Kaur",
      role: "Patient",
      preview: "Your eyewear is ready for pickup at Riverbend.",
      time: "Yesterday",
      unread: false,
    },
    {
      order: "OG-24812",
      with: "Crescent Lens Works",
      role: "Lab",
      preview: "Surfacing complete. Moving to quality inspection.",
      time: "Yesterday",
      unread: false,
    },
  ];

  return (
    <>
      <PanelHeader
        title="Messages"
        subtitle="One thread with labs and patients · tied to each order"
        searchPlaceholder="Search threads"
      />
      <StatGrid
        items={[
          { label: "Unread", value: "4", delta: "2 lab · 2 patient", icon: MessageSquare },
          { label: "Open threads", value: "18", delta: "Across 3 locations", icon: Activity },
          { label: "Median reply", value: "14m", delta: "Last 7 days", icon: Clock },
          { label: "Resolved today", value: "11", delta: "No voicemail chase", icon: CheckCircle2 },
        ]}
      />
      <div className="space-y-2 p-4 sm:p-6">
        {threads.map((t) => (
          <div
            key={t.order + t.with}
            className={cn(
              "flex items-start justify-between gap-3 rounded-xl border px-4 py-3",
              t.unread ? "border-electric/25 bg-accent/50" : "border-border bg-mist/40",
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-semibold text-navy">{t.with}</p>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    t.role === "Lab"
                      ? "border-electric/25 bg-electric/10 text-electric"
                      : "border-aqua/40 bg-aqua/15 text-navy",
                  )}
                >
                  {t.role}
                </span>
                {t.unread && (
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                )}
              </div>
              <p className="mt-1 truncate text-[12px] text-muted-foreground">{t.preview}</p>
              <p className="mt-1 font-mono text-[10.5px] text-muted-foreground">{t.order}</p>
            </div>
            <p className="shrink-0 text-[11px] text-muted-foreground">{t.time}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function PaymentsView() {
  const invoices = [
    { lab: "Northline Optical Lab", amount: "$4,280", status: "Due Mar 18", open: true },
    { lab: "Crescent Lens Works", amount: "$3,110", status: "Paid", open: false },
    { lab: "Meridian Optical", amount: "$2,640", status: "Due Mar 21", open: true },
    { lab: "Summit Precision Lab", amount: "$1,890", status: "Draft", open: true },
    { lab: "Northline Optical Lab", amount: "$5,020", status: "Paid", open: false },
  ];

  return (
    <>
      <PanelHeader
        title="Payments"
        subtitle="Lab invoices and spend in one place · demo practice"
        searchPlaceholder="Search invoices"
      />
      <StatGrid
        items={[
          { label: "Outstanding", value: "$12.4k", delta: "3 invoices open", icon: CreditCard },
          { label: "Paid (90d)", value: "$71.8k", delta: "Across 4 labs", icon: CheckCircle2 },
          { label: "Avg / order", value: "$77", delta: "−3.2% vs prior", icon: BarChart3 },
          { label: "Next draft", value: "Mar 15", delta: "Northline cycle", icon: Clock },
        ]}
      />
      <div className="overflow-x-auto px-1 pb-5 sm:px-3">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-semibold">Laboratory</th>
              <th className="px-3 py-2 font-semibold">Amount</th>
              <th className="px-3 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={`${inv.lab}-${i}`} className="border-t border-border/70 hover:bg-muted/50">
                <td className="px-3 py-3 text-[12.5px] font-medium text-navy">{inv.lab}</td>
                <td className="px-3 py-3 text-[12.5px] text-navy">{inv.amount}</td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
                      inv.open
                        ? "border-electric/25 bg-electric/10 text-electric"
                        : "border-aqua/40 bg-aqua/15 text-navy",
                    )}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IntegrationsView() {
  return (
    <>
      <PanelHeader
        title="Integrations"
        subtitle="PMS and LMS connections in one place"
        searchPlaceholder="Search systems"
      />
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-border bg-background p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-electric">
                  {item.type === "PMS" ? (
                    <Cpu className="h-4 w-4" />
                  ) : (
                    <LensesIcon className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.type}</p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                  item.status === "Connected"
                    ? "border-electric/25 bg-electric/10 text-electric"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                {item.status}
              </span>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">Last sync: {item.sync}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function AnalyticsView() {
  return (
    <>
      <PanelHeader
        title="Analytics"
        subtitle="Decision support from verified PMS → LMS orders"
        searchPlaceholder="Filter metrics"
      />
      <div className="grid grid-cols-2 gap-3 border-b border-border px-4 py-4 sm:px-6 lg:grid-cols-4">
        {analytics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-mist/60 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-1.5 font-display text-xl font-bold text-navy">{m.value}</p>
            <p
              className={cn(
                "mt-1 inline-flex items-center gap-1 text-[10px] font-semibold",
                m.up ? "text-electric" : "text-aqua",
              )}
            >
              {m.up ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {m.change}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Orders by LMS (90 days)
        </p>
        <div className="mt-4 space-y-3">
          {bars.map((b) => (
            <div key={b.lab}>
              <div className="mb-1 flex items-center justify-between text-[12px]">
                <span className="font-medium text-navy">{b.lab}</span>
                <span className="text-muted-foreground">{b.pct}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-electric to-aqua"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function DashboardMockup() {
  const [view, setView] = useState<ViewId>("Orders");

  const content: Record<ViewId, ReactNode> = {
    Overview: <OverviewView onOpen={setView} />,
    Orders: <OrdersView />,
    Messages: <MessagesView />,
    LMS: <LabsView />,
    Payments: <PaymentsView />,
    Integrations: <IntegrationsView />,
    Analytics: <AnalyticsView />,
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-float">
      <div className="flex items-center gap-2 border-b border-border bg-mist px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="mx-auto rounded-md bg-background px-3 py-1 font-mono text-[10px] text-muted-foreground">
          {viewPaths[view]}
        </span>
      </div>

      <div className="flex flex-col md:flex-row">
        <aside className="hidden w-52 shrink-0 flex-col bg-sidebar px-3 py-4 md:flex">
          <div className="flex items-center gap-2 px-2 pb-5">
            <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-electric to-aqua" />
            <span className="font-display text-sm font-bold text-sidebar-foreground">OptiGo</span>
          </div>
          <nav className="space-y-0.5">
            {sidebar.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors",
                  view === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60",
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-aqua">
              Demo data
            </p>
            <p className="mt-1 text-[11px] leading-snug text-sidebar-foreground/60">
              Click the sidebar to explore messages, payments, analytics, and more.
            </p>
          </div>
        </aside>

        {/* Mobile view switcher */}
        <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
          {sidebar.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={cn(
                "shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold",
                view === item.id
                  ? "bg-navy text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1 bg-background">{content[view]}</div>
      </div>
    </div>
  );
}
