"use client";

import { useState } from "react";

export interface FaqTopic {
  key: string;
  label: string;
  items: readonly { q: string; a: string }[];
}

/** Topic filter + accordion (design/source/FAQ.dc.html). Buttons use aria-pressed. */
export function FaqBrowser({ topics }: { topics: readonly FaqTopic[] }) {
  const [active, setActive] = useState(topics[0]?.key ?? "");
  const topic = topics.find((t) => t.key === active) ?? topics[0];
  return (
    <div className="faq-layout">
      <div className="faq-topics" role="group" aria-label="Topics">
        {topics.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={t.key === active}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {topic ? (
        <div className="faq-list" aria-live="polite">
          <h2>{topic.label}</h2>
          {topic.items.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      ) : null}
    </div>
  );
}
