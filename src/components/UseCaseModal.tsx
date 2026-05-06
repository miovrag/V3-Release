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
    <div className="cg-overlay">
      <div className="cg-modal" style={{ maxWidth: 600 }}>
        <button className="cg-modal-close" onClick={onClose} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{ padding: "32px 32px 28px" }}>
          <p style={{
            font: "600 16px/24px var(--cg-font-sans)",
            color: "var(--cg-fg-1)",
            textAlign: "center",
            marginBottom: 24,
          }}>
            While your agent is getting ready, which use case best describes it?
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}>
            {USE_CASES.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setSelected(uc.id)}
                style={{
                  padding: "16px 12px",
                  borderRadius: 12,
                  border: `2px solid ${selected === uc.id ? "var(--cg-primary)" : "var(--cg-gray-200)"}`,
                  background: selected === uc.id ? "var(--cg-primary-100)" : "var(--cg-bg-card)",
                  font: `600 13px/18px var(--cg-font-sans)`,
                  color: selected === uc.id ? "var(--cg-primary-active)" : "var(--cg-fg-2)",
                  transition: "all var(--cg-dur-fast)",
                  textAlign: "center",
                }}
              >
                {uc.label}
              </button>
            ))}
          </div>

          <p style={{
            font: "400 13px/20px var(--cg-font-sans)",
            color: "var(--cg-fg-3)",
            textAlign: "center",
            marginBottom: 20,
          }}>
            Your agent will be able to resolve 93% of customer support questions — instantly and accurately.
          </p>

          <button className="btn primary lg full" onClick={onNext}>Continue</button>
          <button
            className="btn ghost md full"
            style={{ marginTop: 8 }}
            onClick={onNext}
          >
            No, I want my agent to do something else
          </button>
        </div>
      </div>
    </div>
  );
}
