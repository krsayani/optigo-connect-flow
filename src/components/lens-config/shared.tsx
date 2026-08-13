import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LensConfigDatabase } from "@/lib/lens-config/types";

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  id,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <Input
        id={id}
        type={type}
        required={required}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NativeSelect({
  id,
  label,
  value,
  onChange,
  options,
  allowEmpty,
  emptyLabel = "None",
  disabled,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  allowEmpty?: boolean;
  emptyLabel?: string;
  disabled?: boolean;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <select
        id={id}
        disabled={disabled}
        className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-base shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:h-9 md:text-sm"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
      >
        {allowEmpty ? <option value="">{emptyLabel}</option> : <option value="">Select…</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge
      variant={active ? "secondary" : "outline"}
      className={cn(!active && "text-muted-foreground")}
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

export function nameOf(
  rows: Array<{ id: string; name?: string; productName?: string }>,
  id: string | null,
  fallback = "None",
): string {
  if (!id) return fallback;
  const row = rows.find((item) => item.id === id);
  return row?.name ?? row?.productName ?? fallback;
}

export function offeringLabel(db: LensConfigDatabase, offeringId: string): string {
  const offering = db.offerings.find((row) => row.id === offeringId);
  if (!offering) return offeringId;
  const lab = nameOf(db.labs, offering.labId);
  return `${lab} · ${offering.labProductName}`;
}
