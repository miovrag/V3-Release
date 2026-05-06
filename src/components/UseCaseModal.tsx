"use client";
import { useState } from "react";

const USE_CASES = [
  { id: "support",  label: "Customer support" },
  { id: "search",   label: "Enterprise search" },
  { id: "copilot",  label: "Website copilot" },
  { id: "product",  label: "Product lookup" },
  { id: "leads",    label: "Lead generation" },
  { id: "revenue",  label: "Revenue agent" },
];

interface Props {
  onNext: () => void;
  onClose: () => void;
}

export default function UseCaseModal({ onNext, onClose }: Props) {
  const [selected, setSelected] = useState("support");

  return (
    <div className="modal-overlay">
      <div className="modal-premium" style={{ flexDirection: "column" }}>
        <button className="modal-close" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "var(--spacing-lg)", right: "var(--spacing-lg)" }}>
          <i className="ti ti-x" />
        </button>

        <div className="modal-body">
          <h2 className="modal-heading" style={{ fontSize: "var(--text-xl)" }}>
            Which use case best describes your agent?
          </h2>
          <p className="modal-desc">
            While your agent is getting ready, help us configure it for you.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "var(--spacing-sm)",
          }}>
            {USE_CASES.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setSelected(uc.id)}
                style={{
                  padding: "var(--spacing-md)",
                  borderRadius: "var(--radius-md)",
                  border: `2px solid ${selected === uc.id ? "var(--brand-primary-default)" : "var(--border-default)"}`,
                  background: selected === uc.id ? "var(--brand-primary-tint)" : "var(--bg-surface)",
                  fontSize: "var(--text-sm)",
                  fontWeight: selected === uc.id ? "var(--weight-semibold)" : "var(--weight-regular)",
                  color: selected === uc.id ? "var(--brand-primary-active)" : "var(--text-body)",
                  cursor: "pointer",
                  transition: "all var(--t-state)",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
              >
                {uc.label}
              </button>
            ))}
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary btn-full" onClick={onNext}>
              Continue
            </button>
            <button className="btn-notnow" style={{ textAlign: "center" }} onClick={onNext}>
              My agent does something else
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
