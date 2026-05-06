"use client";
import NextGenBadge from "./NextGenBadge";

const AGENTS = [
  { id: 1, name: "Support Agent",    desc: "Customer support for our product",         queries: 1842,  isNextGen: true,  isMulti: false, hue: "#7367F0" },
  { id: 2, name: "Sales Copilot",    desc: "Lead qualification and revenue flows",      queries: 934,   isNextGen: true,  isMulti: false, hue: "#0076E5" },
  { id: 3, name: "Docs Search",      desc: "Enterprise documentation search",           queries: 3201,  isNextGen: false, isMulti: false, hue: "#28C76F" },
  { id: 4, name: "Research Hub",     desc: "Deep research across all sources",          queries: 567,   isNextGen: true,  isMulti: true,  hue: "#FF9F43" },
  { id: 5, name: "HR Assistant",     desc: "Internal HR policies and onboarding",       queries: 289,   isNextGen: false, isMulti: false, hue: "#EA5455" },
];

export default function AgentsList() {
  return (
    <div style={{
      background: "var(--cg-bg-card)",
      border: "1px solid var(--cg-gray-200)",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "var(--cg-shadow-card)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid var(--cg-gray-200)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ font: "600 15px/22px var(--cg-font-sans)", color: "var(--cg-fg-1)" }}>Agents</span>
          <span style={{
            font: "500 11px/16px var(--cg-font-sans)",
            color: "var(--cg-fg-3)",
            background: "var(--cg-gray-100)",
            padding: "1px 8px",
            borderRadius: 999,
          }}>
            {AGENTS.length}
          </span>
        </div>
        <button className="btn primary sm">+ New agent</button>
      </div>

      {/* Rows */}
      {AGENTS.map((agent, i) => (
        <div
          key={agent.id}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 24px",
            borderBottom: i < AGENTS.length - 1 ? "1px solid var(--cg-gray-100)" : "none",
            cursor: "pointer",
            transition: "background var(--cg-dur-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cg-gray-50)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: agent.hue,
            opacity: 0.9,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", font: "700 14px/1 var(--cg-font-sans)",
          }}>
            {agent.name.charAt(0)}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ font: "600 14px/20px var(--cg-font-sans)", color: "var(--cg-fg-1)" }}>
                {agent.name}
              </span>
              {agent.isNextGen && <NextGenBadge size="sm" />}
              {agent.isMulti && (
                <span className="b soft-primary">Multi-Agent</span>
              )}
            </div>
            <p style={{ font: "400 12px/16px var(--cg-font-sans)", color: "var(--cg-fg-3)", margin: 0 }}>
              {agent.desc}
            </p>
          </div>

          {/* Queries */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ font: "600 14px/20px var(--cg-font-sans)", color: "var(--cg-fg-2)" }}>
              {agent.queries.toLocaleString()}
            </div>
            <div style={{ font: "400 11px/16px var(--cg-font-sans)", color: "var(--cg-fg-3)" }}>
              queries
            </div>
          </div>

          {/* Chevron */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4L10 8L6 12" stroke="var(--cg-gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ))}
    </div>
  );
}
