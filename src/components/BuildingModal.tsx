"use client";

interface Props {
  onClose: () => void;
  onDone: () => void;
}

const STEPS = [
  { label: "Adding", detail: "500 documents", active: true },
  { label: "Document processing not started", detail: "", active: false },
  { label: "Agent personalization not started", detail: "", active: false },
];

export default function BuildingModal({ onClose, onDone }: Props) {
  return (
    <div className="cg-overlay">
      <div className="cg-modal" style={{ maxWidth: 480 }}>
        <button className="cg-modal-close" onClick={onClose} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{ padding: "32px 32px 28px" }}>
          <h3 className="cg-h3" style={{ textAlign: "center", marginBottom: 24 }}>
            Building your agent
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {STEPS.map((step, i) => (
              <div key={i} className="step-row">
                <div className={`step-circle ${step.active ? "active" : ""}`}>
                  {step.active && <div className="cg-spinner" style={{ width: 16, height: 16, border: "2px solid var(--cg-primary-100)", borderTopColor: "var(--cg-primary)" }} />}
                </div>
                <span style={{
                  flex: 1,
                  font: "500 14px/20px var(--cg-font-sans)",
                  color: "var(--cg-fg-2)",
                }}>
                  {step.label}
                </span>
                {step.detail && (
                  <span style={{ font: "400 13px/18px var(--cg-font-sans)", color: "var(--cg-fg-3)" }}>
                    {step.detail}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p style={{
            font: "400 13px/20px var(--cg-font-sans)",
            color: "var(--cg-fg-3)",
            textAlign: "center",
            marginBottom: 20,
          }}>
            You can chat with your agent as soon as we process a couple of documents. Feel free to leave — we&apos;ll notify you when it&apos;s ready.
          </p>

          <button className="btn primary lg full" style={{ opacity: 0.55 }} onClick={onDone} disabled>
            Try your new agent
          </button>
        </div>
      </div>
    </div>
  );
}
