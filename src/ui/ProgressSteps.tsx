"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export interface ProgressStep {
  title: string;
  body: ReactNode;
}

/**
 * Steps that play in sequence when scrolled into view: each card rises in, its number lights up,
 * then a progress line fills toward the next step. Runs once. Without JavaScript, or with
 * "reduce motion" on, the steps render in their final state.
 */
export function ProgressSteps({ items }: { items: readonly ProgressStep[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    // Already on screen (e.g. page restored mid-scroll): show it, don't replay.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) return;

    el.dataset.anim = "ready";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.anim = "in";
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className="steps steps-progress">
      {items.map((s, i) => (
        <li key={s.title} style={{ "--i": i } as CSSProperties}>
          <div className="step-head" aria-hidden="true">
            <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
            {i < items.length - 1 ? (
              <span className="step-line">
                <span className="step-fill" />
              </span>
            ) : null}
          </div>
          <h3>{s.title}</h3>
          <div>{s.body}</div>
        </li>
      ))}
    </ol>
  );
}
