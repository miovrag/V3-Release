"use client";
import EnterpriseAgentsBadge from "./EnterpriseAgentsBadge";

interface AgentsListProps {
  onEnableEnterpriseAgents?: (agentName: string) => void;
}

const AGENTS = [
  { id: 1, name: "Support Agent",  desc: "Customer support for our product",     queries: 1842, isEnterpriseAgents: true,  isMulti: false, initials: "S", color: "var(--brand-primary-tint)",        textColor: "var(--brand-primary-default)" },
  { id: 2, name: "Sales Copilot",  desc: "Lead qualification and revenue flows",  queries: 934,  isEnterpriseAgents: true,  isMulti: false, initials: "S", color: "var(--color-info-tint)",           textColor: "var(--color-info)" },
  { id: 3, name: "Docs Search",    desc: "Enterprise documentation search",       queries: 3201, isEnterpriseAgents: false, isMulti: false, initials: "D", color: "var(--color-success-tint)",        textColor: "var(--color-success)" },
  { id: 4, name: "Research Hub",   desc: "Deep research across all sources",      queries: 567,  isEnterpriseAgents: true,  isMulti: true,  initials: "R", color: "var(--color-warning-tint)",        textColor: "var(--color-warning)" },
  { id: 5, name: "HR Assistant",   desc: "Internal HR policies and onboarding",   queries: 289,  isEnterpriseAgents: false, isMulti: false, initials: "H", color: "var(--color-error-tint)",          textColor: "var(--color-error)" },
];

export default function AgentsList({ onEnableEnterpriseAgents }: AgentsListProps = {}) {
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--spacing-lg) var(--spacing-xl)",
        borderBottom: "1px solid var(--border-default)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <span style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
            Agents
          </span>
          <span className="badge badge-default">{AGENTS.length}</span>
        </div>
        <button className="btn btn-primary btn-sm">
          <i className="ti ti-plus" />
          New agent
        </button>
      </div>

      {/* Rows */}
      {AGENTS.map((agent, i) => (
        <div
          key={agent.id}
          className="nav-item"
          style={{
            borderRadius: 0,
            borderBottom: i < AGENTS.length - 1 ? "1px solid var(--border-default)" : "none",
            padding: "var(--spacing-md) var(--spacing-xl)",
            gap: "var(--spacing-md)",
          }}
        >
          {/* Avatar */}
          <div style={{
            width: 36, height: 36,
            borderRadius: "var(--radius-md)",
            background: agent.color,
            color: agent.textColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-bold)",
            flexShrink: 0,
          }}>
            {agent.initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", marginBottom: 2 }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
                {agent.name}
              </span>
              {agent.isEnterpriseAgents && <EnterpriseAgentsBadge />}
              {agent.isMulti && (
                <span className="badge badge-primary">Multi-Agent</span>
              )}
              {!agent.isEnterpriseAgents && onEnableEnterpriseAgents && (
                <button
                  onClick={e => { e.stopPropagation(); onEnableEnterpriseAgents(agent.name); }}
                  style={{
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)",
                    color: "var(--brand-primary-default)", fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  Enable Enterprise Agents →
                </button>
              )}
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {agent.desc}
            </p>
          </div>

          {/* Queries */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-body)" }}>
              {agent.queries.toLocaleString()}
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>queries</div>
          </div>

          <i className="ti ti-chevron-right" style={{ color: "var(--border-emphasis)", fontSize: 16, flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}
