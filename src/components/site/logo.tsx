import { cn } from "@/lib/utils";

export function OptiGoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
      fill="none"
    >
      <defs>
        <linearGradient id="og-mark" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="oklch(0.58 0.19 258)" />
          <stop offset="100%" stopColor="oklch(0.78 0.11 195)" />
        </linearGradient>
      </defs>
      <path
        d="M2 16c4.2-6.4 8.9-9.6 14-9.6S26.8 9.6 31 16c-4.2 6.4-8.9 9.6-14 9.6S6.2 22.4 2 16Z"
        stroke="url(#og-mark)"
        strokeWidth="1.8"
        opacity="0.85"
      />
      <circle cx="16.4" cy="16" r="5.4" stroke="url(#og-mark)" strokeWidth="1.8" />
      <circle cx="16.4" cy="16" r="1.9" fill="url(#og-mark)" />
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
          "font-display text-[1.28rem] font-extrabold tracking-tight",
          tone === "light" ? "text-on-dark" : "text-navy",
        )}
      >
        Opti<span className="text-electric">Go</span>
      </span>
    </span>
  );
}
