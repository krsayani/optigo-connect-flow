import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Reveal immediately if already in (or near) the viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.08, rootMargin: "40px 0px -20px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <As
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", shown && "reveal-in", className)}
    >
      {children}
    </As>
  );
}
