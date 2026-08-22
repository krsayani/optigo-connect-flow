import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/submit-lead";

const base = {
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().max(1000).optional(),
};

const demoSchema = z.object({
  ...base,
  company: z.string().trim().min(1, "Practice / company is required").max(120),
  role: z.string().trim().max(120).optional(),
  locations: z.string().trim().max(40).optional(),
  ehr: z.string().trim().max(160).optional(),
  labs: z.string().trim().max(160).optional(),
});

const partnerSchema = z.object({
  ...base,
  company: z.string().trim().min(1, "Company is required").max(120),
  type: z.string().trim().min(1, "Select a partner type"),
});

const signupSchema = z.object({
  ...base,
  accountType: z.enum(["practice", "lab"], {
    required_error: "Select an account type",
  }),
  company: z.string().trim().min(1, "Organization name is required").max(120),
  role: z.string().trim().max(120).optional(),
  locations: z.string().trim().max(40).optional(),
  systems: z.string().trim().max(200).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
});

export type SignupAccountType = "practice" | "lab";

type Errors = Record<string, string>;
type FormType = "demo" | "partner" | "signup";

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string | undefined;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[12px] font-semibold text-navy">
        {label}
        {required && <span className="text-electric"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={255}
        className={cn(
          "mt-1.5 w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-electric focus:ring-4 focus:ring-electric/10",
          error ? "border-destructive" : "border-border",
        )}
      />
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}

function TextArea({ label, name, error }: { label: string; name: string; error?: string | undefined }) {
  return (
    <label className="block sm:col-span-2">
      <span className="text-[12px] font-semibold text-navy">{label}</span>
      <textarea
        name={name}
        rows={4}
        maxLength={1000}
        className={cn(
          "mt-1.5 w-full resize-none rounded-xl border bg-background px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-electric focus:ring-4 focus:ring-electric/10",
          error ? "border-destructive" : "border-border",
        )}
      />
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}

function useFormSubmit(schema: z.ZodTypeAny, formType: FormType, successMsg: string) {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const result = schema.safeParse(data);
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please review the highlighted fields.");
      return;
    }

    setErrors({});
    setPending(true);
    try {
      await submitLead({
        data: {
          formType,
          ...result.data,
        },
      });
      setDone(true);
      form.reset();
      toast.success(successMsg);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't send your request. Please try again in a moment.");
    } finally {
      setPending(false);
    }
  };

  return { errors, done, pending, onSubmit };
}

const Submit = ({ label, pending }: { label: string; pending?: boolean }) => (
  <button
    type="submit"
    disabled={pending}
    className="group mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-14px_oklch(0.24_0.058_262/0.6)] transition-all hover:-translate-y-0.5 hover:bg-electric disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:col-span-2"
  >
    {pending ? (
      <>
        Sending
        <Loader2 className="h-4 w-4 animate-spin" />
      </>
    ) : (
      <>
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </>
    )}
  </button>
);

const Note = () => (
  <p className="text-[11px] leading-relaxed text-muted-foreground sm:col-span-2">
    Please do not include patient health information in this form. We'll only use your details
    to respond to your inquiry.
  </p>
);

export function DemoForm() {
  const { errors, done, pending, onSubmit } = useFormSubmit(
    demoSchema,
    "demo",
    "Thanks — we'll be in touch shortly.",
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Name" name="name" required error={errors["name"]} />
      <Field label="Practice / Company" name="company" required error={errors["company"]} />
      <Field label="Role" name="role" placeholder="Owner, Optician, Office Manager…" />
      <Field label="Email" name="email" type="email" required error={errors["email"]} />
      <Field label="Phone" name="phone" type="tel" />
      <Field label="Number of Locations" name="locations" placeholder="1–5, 6–20, 20+" />
      <Field
        label="Current practice"
        name="ehr"
        className="sm:col-span-2"
      />
      <Field label="Primary Optical Labs" name="labs" className="sm:col-span-2" />
      <TextArea label="Message" name="message" />
      <Note />
      <Submit label="Request a Demo" pending={pending} />
      {done && (
        <p className="text-[12px] font-medium text-electric sm:col-span-2">
          Request received. A member of the LensFlow team will follow up by email.
        </p>
      )}
    </form>
  );
}

const partnerTypes = [
  "Optical Laboratory",
  "Practice",
  "Technology Partner",
  "Other",
];

export function PartnerForm() {
  const { errors, done, pending, onSubmit } = useFormSubmit(
    partnerSchema,
    "partner",
    "Thanks — we'll reach out about integrating with LensFlow.",
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Name" name="name" required error={errors["name"]} />
      <Field label="Company" name="company" required error={errors["company"]} />
      <label className="block sm:col-span-2">
        <span className="text-[12px] font-semibold text-navy">
          Type<span className="text-electric"> *</span>
        </span>
        <select
          name="type"
          defaultValue=""
          className={cn(
            "mt-1.5 w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-electric focus:ring-4 focus:ring-electric/10",
            errors["type"] ? "border-destructive" : "border-border",
          )}
        >
          <option value="" disabled>
            Select partner type
          </option>
          {partnerTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors["type"] && (
          <span className="mt-1 block text-[11px] text-destructive">{errors["type"]}</span>
        )}
      </label>
      <Field label="Email" name="email" type="email" required error={errors["email"]} />
      <Field label="Phone" name="phone" type="tel" />
      <TextArea label="Message" name="message" />
      <Note />
      <Submit label="Partner With LensFlow" pending={pending} />
      {done && (
        <p className="text-[12px] font-medium text-electric sm:col-span-2">
          Thanks for reaching out — we'll be in touch about integration options.
        </p>
      )}
    </form>
  );
}

export function SignupForm({
  accountType,
  onChangeType,
}: {
  accountType: SignupAccountType;
  onChangeType?: () => void;
}) {
  const { errors, done, pending, onSubmit } = useFormSubmit(
    signupSchema,
    "signup",
    "Welcome to LensFlow — your signup request was received.",
  );

  const isPractice = accountType === "practice";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="accountType" value={accountType} />

      <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-electric/20 bg-accent/60 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-electric">
            Signing up as
          </p>
          <p className="mt-0.5 text-sm font-semibold text-navy">
            {isPractice ? "Practice" : "Lab"}
          </p>
        </div>
        {onChangeType && (
          <button
            type="button"
            onClick={onChangeType}
            className="text-xs font-semibold text-electric underline-offset-2 hover:underline"
          >
            Change
          </button>
        )}
      </div>

      <Field label="Full name" name="name" required error={errors["name"]} />
      <Field
        label={isPractice ? "Practice name" : "Laboratory name"}
        name="company"
        required
        error={errors["company"]}
      />
      <Field
        label="Work email"
        name="email"
        type="email"
        required
        error={errors["email"]}
        placeholder="you@organization.com"
      />
      <Field label="Phone" name="phone" type="tel" />
      <Field
        label="Your role"
        name="role"
        placeholder={
          isPractice ? "Owner, Optician, Office Manager…" : "Operations, IT, Partnerships…"
        }
      />
      <Field
        label={isPractice ? "Number of locations" : "Practices you serve"}
        name="locations"
        placeholder={isPractice ? "1–5, 6–20, 20+" : "Approx. count or region"}
      />
      <Field
        label={isPractice ? "Current practice" : "Lab"}
        name="systems"
        className="sm:col-span-2"
        placeholder={isPractice ? "Crystal, DVI, Ocuco…" : "Your lab"}
      />
      <Field
        label="Create a password"
        name="password"
        type="password"
        required
        error={errors["password"]}
        className="sm:col-span-2"
        placeholder="At least 8 characters"
      />
      <TextArea
        label="Anything else we should know?"
        name="message"
        error={errors["message"]}
      />
      <Note />
      <Submit
        label={isPractice ? "Create practice account" : "Create lab account"}
        pending={pending}
      />
      {done && (
        <p className="text-[12px] font-medium text-electric sm:col-span-2">
          Account request received. We'll email you next steps to activate LensFlow.
        </p>
      )}
      {errors["accountType"] && (
        <p className="text-[11px] text-destructive sm:col-span-2">{errors["accountType"]}</p>
      )}
    </form>
  );
}
