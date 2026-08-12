import { cn } from "@/lib/utils";

export function OptiGoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
      fill="none"
    >
      <defs>
        <linearGradient id="og-mark" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="oklch(0.58 0.19 258)" />
          <stop offset="100%" stopColor="oklch(0.78 0.11 195)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="oklch(0.17 0.045 262)" />
      <path
        d="M4 16c4.2-6.4 8.9-9.6 12-9.6S23.8 9.6 28 16c-4.2 6.4-8.9 9.6-12 9.6S8.2 22.4 4 16Z"
        stroke="url(#og-mark)"
        strokeWidth="1.7"
        opacity="0.95"
      />
      <circle cx="16" cy="16" r="5" stroke="url(#og-mark)" strokeWidth="1.7" />
      <circle cx="16" cy="16" r="1.75" fill="url(#og-mark)" />
    </svg>
  );
}

export function OptiGoWordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <OptiGoMark />
      <span
        className={cn(
          "font-display text-[1.35rem] font-extrabold tracking-[-0.04em]",
          tone === "light" ? "text-on-dark" : "text-navy",
        )}
      >
        Opti<span className="text-electric">Go</span>
      </span>
    </span>
  );
}
