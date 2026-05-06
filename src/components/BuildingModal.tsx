"use client";

interface Props {
  onClose: () => void;
  onDone: () => void;
}

const STEPS = [
  { label: "Adding documents", detail: "500 documents", active: true },
  { label: "Document processing not started", detail: "", active: false },
  { label: "Agent personalization not started", detail: "", active: false },
];

export default function BuildingModal({ onClose, onDone }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-premium" style={{ flexDirection: "column" }}>
        <button className="modal-close" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "var(--spacing-lg)", right: "var(--spacing-lg)" }}>
          <i className="ti ti-x" />
        </button>

        <div className="modal-body">
          <h2 className="modal-heading">Building your agent</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            {STEPS.map((step, i) => (
              <div key={i} className="step-row">
                <div className={`step-circle${step.active ? " is-active" : ""}`}>
                  {step.active && <div className="spinner" />}
                </div>
                <span style={{
                  flex: 1,
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--text-body)",
                }}>
                  {step.label}
                </span>
                {step.detail && (
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                    {step.detail}
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="modal-desc">
            You can chat with your agent as soon as we process a couple of documents. Feel free to leave — we&apos;ll notify you when it&apos;s ready.
          </p>

          <button className="btn btn-primary btn-full" disabled onClick={onDone}>
            Try your new agent
          </button>
        </div>
      </div>
    </div>
  );
}
