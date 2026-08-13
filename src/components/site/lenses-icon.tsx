import { cn } from "@/lib/utils";

/** Simple dual-lens mark for lab nodes. */
export function LensesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
    >
      <circle cx="9" cy="12" r="5.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="15" cy="12" r="5.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="9" cy="12" r="1.6" fill="currentColor" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
