"use client";
import NextGenBadge from "./NextGenBadge";

interface Props {
  agentName: string;
  isNextGen: boolean;
  onNextGenClick?: () => void;
}

const TABS = ["Overview", "Sources", "Customize", "Intelligence", "Deploy", "Analytics"];

export default function AgentDetailHeader({ agentName, isNextGen, onNextGenClick }: Props) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-default)",
      padding: "var(--spacing-xl) var(--spacing-xl) 0",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-md)",
        marginBottom: "var(--spacing-lg)",
      }}>
        {/* Avatar */}
        <div style={{
          width: 40, height: 40,
          borderRadius: "var(--radius-md)",
          background: "var(--brand-primary-tint)",
          color: "var(--brand-primary-default)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "var(--text-md)",
          fontWeight: "var(--weight-bold)",
          flexShrink: 0,
        }}>
          {agentName.charAt(0).toUpperCase()}
        </div>

        {/* Name + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-bold)",
            color: "var(--text-heading)",
            lineHeight: "var(--leading-tight)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {agentName}
          </h1>

          {isNextGen
            ? <NextGenBadge onClick={onNextGenClick} />
            : <span className="badge badge-default">Standard</span>
          }
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "var(--spacing-sm)", flexShrink: 0 }}>
          <button className="btn btn-ghost btn-sm">
            <i className="ti ti-settings" />
            Settings
          </button>
          <button className="btn btn-primary btn-sm">
            <i className="ti ti-message" />
            Open chat
          </button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button key={tab} className={`tab${tab === "Intelligence" ? " is-active" : ""}`}>
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
