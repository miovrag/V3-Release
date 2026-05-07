"use client";

import { useState } from "react";

interface Props {
  onEnable?: () => void;
}

export default function DashboardBanner({ onEnable }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="alert alert-primary" style={{ alignItems: "center" }}>
      <i className="ti ti-bolt" style={{ fontSize: 18, flexShrink: 0, color: "var(--brand-primary-default)" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <strong style={{ color: "var(--text-heading)" }}>NextGen is now available for all your agents</strong>
          <span className="badge-premium" style={{ flexShrink: 0 }}>
            <i className="ti ti-sparkles" style={{ fontSize: 11 }} />
            New
          </span>
        </div>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
          Enable multi-step reasoning on any existing agent — takes 10 seconds in the Intelligence tab.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", flexShrink: 0 }}>
        <button className="btn btn-primary btn-sm" onClick={onEnable}>
          <i className="ti ti-bolt" />
          Enable on agents
        </button>
        <button className="btn-notnow" onClick={() => setDismissed(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
