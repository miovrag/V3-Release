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
      background: "var(--cg-bg-card)",
      borderBottom: "1px solid var(--cg-gray-200)",
      padding: "20px 24px 0",
    }}>
      {/* H1 row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        {/* Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "var(--cg-grad-menu-active)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", font: "700 16px/1 var(--cg-font-sans)",
        }}>
          {agentName.charAt(0).toUpperCase()}
        </div>

        {/* Name + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <h1 style={{
            font: "700 20px/28px var(--cg-font-sans)",
            color: "var(--cg-fg-1)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {agentName}
          </h1>

          {isNextGen ? (
            <NextGenBadge onClick={onNextGenClick} size="md" />
          ) : (
            <span className="b soft-gray">Standard</span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="btn secondary sm">Settings</button>
          <button className="btn primary sm">Open chat</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`cg-tab${tab === "Intelligence" ? " active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
