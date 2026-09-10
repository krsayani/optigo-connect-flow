import { useId } from "react";
import { cn } from "@/lib/utils";

/** Teal lens mark used on the Lovable LensFlow marketing site. */
export function LensFlowMark({ className }: { className?: string }) {
  const uid = `lf${useId().replace(/:/g, "")}`;
  const a = `${uid}-a`;
  const b = `${uid}-b`;
  const c = `${uid}-c`;

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("h-7 w-7", className)}>
      <defs>
        <linearGradient id={a} x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.62 0.13 168)" />
          <stop offset="100%" stopColor="oklch(0.6 0.14 215)" />
        </linearGradient>
        <linearGradient id={b} x1="28" y1="26" x2="6" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.78 0.11 195)" />
          <stop offset="100%" stopColor="oklch(0.68 0.12 175)" />
        </linearGradient>
        <radialGradient id={c} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="oklch(0.98 0.03 190)" />
          <stop offset="100%" stopColor="oklch(0.6 0.14 200)" />
        </radialGradient>
      </defs>
      <path
        d="M3.6 16C8.2 7.9 12.5 4 16 4c6.3 0 10.6 4.6 12.4 12"
        fill="none"
        stroke={`url(#${a})`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M28.4 16C23.8 24.1 19.5 28 16 28 9.7 28 5.4 23.4 3.6 16"
        fill="none"
        stroke={`url(#${b})`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M9.5 19.6c4.6-4.6 8.6-7 13.6-7.6"
        fill="none"
        stroke={`url(#${b})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="16" cy="16" r="3.5" fill={`url(#${c})`} />
      <circle cx="14.9" cy="14.8" r="1" fill="oklch(1 0 0)" opacity="0.85" />
    </svg>
  );
}

export function LensFlowWordmark({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LensFlowMark />
      <span
        className={cn(
          "font-display text-[1.15rem] font-semibold tracking-[-0.02em]",
          tone === "light" ? "text-on-dark" : "text-foreground",
        )}
      >
        Lens<span className={tone === "light" ? "font-normal text-signal-soft" : "font-normal text-signal"}>
          Flow
        </span>
      </span>
    </span>
  );
}
