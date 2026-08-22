import { useId } from "react";
import { cn } from "@/lib/utils";

/** Navy squircle + optical “O” (lens, iris, pupil, catchlight). */
export function LensFlowMark({ className }: { className?: string }) {
  const uid = `og${useId().replace(/:/g, "")}`;
  const gradient = `${uid}-g`;

  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
      fill="none"
    >
      <defs>
        <linearGradient id={gradient} x1="6" y1="4" x2="26" y2="28">
          <stop stopColor="#4C7DFF" />
          <stop offset="1" stopColor="#5EEAD4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#0B1638" />
      <circle
        cx="16"
        cy="16"
        r="9.2"
        stroke={`url(#${gradient})`}
        strokeWidth="2.15"
      />
      <circle
        cx="16"
        cy="16"
        r="4.85"
        stroke={`url(#${gradient})`}
        strokeWidth="1.65"
      />
      <circle cx="16" cy="16" r="2.05" fill={`url(#${gradient})`} />
      <circle cx="14.55" cy="14.4" r="0.85" fill="#F4FBFF" opacity="0.95" />
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
    <span className={cn("flex items-center gap-2", className)}>
      <LensFlowMark />
      <span
        className={cn(
          "font-display text-[1.4rem] font-extrabold leading-none tracking-[-0.045em]",
          tone === "light" ? "text-on-dark" : "text-navy",
        )}
      >
        Lens<span className="text-electric">Flow</span>
      </span>
    </span>
  );
}
