/**
 * Legal page layout (design/source/Privacy.dc.html). Counsel writes the text; until then each
 * section says what it will cover and the page is clearly marked as a draft.
 */
export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: readonly { id: string; heading: string; covers: string }[];
}) {
  return (
    <>
      <section
        className="page-hero page-hero-plain"
        style={{ borderBottom: "1px solid var(--fd-line)" }}
      >
        <div className="container" style={{ maxWidth: 1040 }}>
          <p className="eyebrow">Legal</p>
          <h1>{title}</h1>
          <p className="muted small" style={{ marginTop: 16 }}>
            Not yet published
          </p>
          <div className="notice notice-pending" role="note">
            <p>
              <strong>Awaiting legal approval.</strong> Final wording will be written and approved
              by legal counsel before launch. Until then, this page lists what it will cover.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container legal-layout">
          <nav className="legal-toc" aria-label="On this page">
            <p>On this page</p>
            <ul>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.heading}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="legal-body">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
                <h2 id={`${s.id}-h`}>
                  {i + 1}. {s.heading}
                </h2>
                <p>{s.covers}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
