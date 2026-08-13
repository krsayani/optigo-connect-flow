import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "krsayani11@gmail.com";

const leadSchema = z.object({
  formType: z.enum(["demo", "partner", "signup"]),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(1000).optional(),
  company: z.string().trim().max(120).optional(),
  role: z.string().trim().max(120).optional(),
  locations: z.string().trim().max(40).optional(),
  ehr: z.string().trim().max(160).optional(),
  labs: z.string().trim().max(160).optional(),
  type: z.string().trim().max(120).optional(),
  accountType: z.enum(["practice", "lab"]).optional(),
  systems: z.string().trim().max(200).optional(),
  // Accepted for validation only — never emailed
  password: z.string().max(128).optional(),
});

export type LeadPayload = z.infer<typeof leadSchema>;

function subjectFor(formType: LeadPayload["formType"], data: LeadPayload) {
  if (formType === "demo") return `OptiGo demo request — ${data.company || data.name}`;
  if (formType === "partner") return `OptiGo partner inquiry — ${data.company || data.name}`;
  const kind = data.accountType === "lab" ? "Lab" : "Practice";
  return `OptiGo ${kind} signup — ${data.company || data.name}`;
}

function buildBody(data: LeadPayload) {
  const lines: string[] = [
    `Form: ${data.formType}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
  ];

  if (data.phone) lines.push(`Phone: ${data.phone}`);
  if (data.company) lines.push(`Company / org: ${data.company}`);
  if (data.role) lines.push(`Role: ${data.role}`);
  if (data.locations) lines.push(`Locations / scale: ${data.locations}`);
  if (data.ehr) lines.push(`Practice: ${data.ehr}`);
  if (data.labs) lines.push(`Labs: ${data.labs}`);
  if (data.type) lines.push(`Partner type: ${data.type}`);
  if (data.accountType) lines.push(`Account type: ${data.accountType}`);
  if (data.systems) lines.push(`Systems: ${data.systems}`);
  if (data.formType === "signup") {
    lines.push(`Password provided: ${data.password ? "yes (not included for security)" : "no"}`);
  }
  if (data.message) {
    lines.push("", "Message:", data.message);
  }

  return lines.join("\n");
}

async function sendWithResend(data: LeadPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;

  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM || "OptiGo <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: [NOTIFY_EMAIL],
    replyTo: data.email,
    subject: subjectFor(data.formType, data),
    text: buildBody(data),
  });

  if (error) throw new Error(error.message || "Resend failed");
  return { provider: "resend" as const };
}

async function sendWithFormSubmit(data: LeadPayload) {
  const origin =
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://optigo.app";

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_EMAIL)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/`,
    },
    body: JSON.stringify({
      _subject: subjectFor(data.formType, data),
      _replyto: data.email,
      _template: "table",
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      company: data.company || "",
      role: data.role || "",
      locations: data.locations || "",
      ehr: data.ehr || "",
      labs: data.labs || "",
      partner_type: data.type || "",
      account_type: data.accountType || "",
      systems: data.systems || "",
      form_type: data.formType,
      message: data.message || "",
      password_provided:
        data.formType === "signup" ? (data.password ? "yes" : "no") : undefined,
    }),
  });

  const payload = (await res.json().catch(() => null)) as {
    success?: string | boolean;
    message?: string;
  } | null;

  // First submission asks the inbox owner to activate FormSubmit.
  if (payload?.success === "false" && /activation/i.test(payload.message || "")) {
    return { provider: "formsubmit" as const, needsActivation: true as const };
  }

  if (!res.ok || payload?.success === "false") {
    throw new Error(payload?.message || `Form email failed (${res.status})`);
  }

  return { provider: "formsubmit" as const };
}

export const submitLead = createServerFn({ method: "POST" })
  .validator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    // Prefer Resend when configured; otherwise FormSubmit (no API key required).
    try {
      const viaResend = await sendWithResend(data);
      if (viaResend) return { ok: true as const, ...viaResend };
    } catch (err) {
      console.error("Resend send failed, falling back:", err);
    }

    const result = await sendWithFormSubmit(data);
    return { ok: true as const, ...result };
  });
