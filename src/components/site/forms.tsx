import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

type Errors = Record<string, string>;

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
  error?: string;
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

function TextArea({ label, name, error }: { label: string; name: string; error?: string }) {
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

function useFormSubmit(schema: z.ZodTypeAny, successMsg: string) {
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    setDone(true);
    form.reset();
    toast.success(successMsg);
  };

  return { errors, done, onSubmit };
}

const Submit = ({ label }: { label: string }) => (
  <button
    type="submit"
    className="group mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-electric sm:col-span-2"
  >
    {label}
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
  </button>
);

const Note = () => (
  <p className="text-[11px] leading-relaxed text-muted-foreground sm:col-span-2">
    Please do not include patient health information in this form. We'll only use your details
    to respond to your inquiry.
  </p>
);

export function DemoForm() {
  const { errors, done, onSubmit } = useFormSubmit(
    demoSchema,
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
        label="Current EHR / Practice Management System"
        name="ehr"
        className="sm:col-span-2"
      />
      <Field label="Primary Optical Labs" name="labs" className="sm:col-span-2" />
      <TextArea label="Message" name="message" />
      <Note />
      <Submit label="Request a Demo" />
      {done && (
        <p className="text-[12px] font-medium text-electric sm:col-span-2">
          Request received. A member of the OptiGo team will follow up by email.
        </p>
      )}
    </form>
  );
}

const partnerTypes = [
  "Optical Laboratory",
  "EHR / Practice Management",
  "Technology Partner",
  "Other",
];

export function PartnerForm() {
  const { errors, done, onSubmit } = useFormSubmit(
    partnerSchema,
    "Thanks — we'll reach out about integrating with OptiGo.",
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
      <Submit label="Partner With OptiGo" />
      {done && (
        <p className="text-[12px] font-medium text-electric sm:col-span-2">
          Thanks for reaching out — we'll be in touch about integration options.
        </p>
      )}
    </form>
  );
}
