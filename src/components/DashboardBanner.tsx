"use client";

import { useState } from "react";

interface Props {
  onEnable?: () => void;
}

export default function DashboardBanner({ onEnable }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "var(--spacing-xl)",
      padding: "var(--spacing-lg) var(--spacing-xl)",
      background: "var(--brand-primary-tint)",
      border: "1px solid rgba(115,103,240,.2)",
      borderRadius: "var(--radius-xl)",
      animation: "modal-enter 200ms cubic-bezier(.2,.7,.3,1) both",
    }}>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-lg)", minWidth: 0 }}>
        <div style={{
          width: 40, height: 40, flexShrink: 0,
          borderRadius: "var(--radius-md)",
          background: "var(--brand-primary-default)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <i className="ti ti-bolt" style={{ color: "#fff", fontSize: 20 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
              NextGen is now available for all your agents
            </span>
            <span className="badge-premium" style={{ flexShrink: 0 }}>
              <i className="ti ti-sparkles" style={{ fontSize: 11 }} />
              New
            </span>
          </div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)" }}>
            Enable multi-step reasoning on any existing agent — takes 10 seconds in the Intelligence tab.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", flexShrink: 0 }}>
        <button className="btn btn-primary btn-sm" onClick={onEnable}>
          <i className="ti ti-bolt" />
          Enable on agents
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: "var(--spacing-xs)",
            borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)",
            fontFamily: "inherit", fontWeight: "var(--weight-medium)",
            transition: "color var(--t-state)",
          }}
        >
          Dismiss
        </button>
      </div>

    </div>
  );
}
