"use client";

interface Props {
  action: string;
  status: "pending" | "approved" | "denied";
  onAllow: () => void;
  onDeny: () => void;
}

export default function ToolCallCard({ action, status, onAllow, onDeny }: Props) {
  return (
    <div className="action-card" style={{
      display: "flex",
      width: 574,
      padding: "8px 16px",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 8,
      borderRadius: 8,
      background: "#FFF",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
        <i
          className="ti ti-lock"
          style={{
            fontSize: 16,
            color: status === "denied" ? "var(--text-muted)" : "var(--color-error)",
            flexShrink: 0,
          }}
        />

        <span style={{
          flex: 1,
          fontFamily: "ui-monospace, 'JetBrains Mono', monospace",
          fontSize: 13,
          fontWeight: 600,
          color: status === "denied" ? "var(--text-muted)" : "var(--text-heading)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {action}
        </span>

        {status === "pending" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={onAllow} className="btn btn-primary btn-sm">
              Allow once
            </button>
            <button onClick={onAllow} className="btn btn-secondary btn-sm">
              For session
            </button>
            <button onClick={onDeny} className="btn-notnow">
              Deny
            </button>
          </div>
        )}

        {status === "approved" && (
          <span style={{
            display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
            fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)",
            color: "var(--color-success)",
          }}>
            <i className="ti ti-circle-check" style={{ fontSize: 14 }} />
            Approved
          </span>
        )}

        {status === "denied" && (
          <span style={{
            display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
            fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)",
            color: "var(--text-muted)",
          }}>
            <i className="ti ti-circle-x" style={{ fontSize: 14 }} />
            Denied
          </span>
        )}
      </div>
    </div>
  );
}
