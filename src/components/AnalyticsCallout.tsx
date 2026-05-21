"use client";

interface Agent {
  name: string;
  initials: string;
  color: string;
  textColor: string;
  queries: number;
  isEnterpriseAgents: boolean;
}

const AGENTS: Agent[] = [
  { name: "Support Agent",  initials: "S", color: "var(--brand-primary-tint)",   textColor: "var(--brand-primary-default)", queries: 1842, isEnterpriseAgents: true },
  { name: "Sales Copilot",  initials: "S", color: "var(--color-info-tint)",      textColor: "var(--color-info)",            queries: 934,  isEnterpriseAgents: true },
  { name: "Docs Search",    initials: "D", color: "var(--color-success-tint)",   textColor: "var(--color-success)",         queries: 3201, isEnterpriseAgents: false },
  { name: "Research Hub",   initials: "R", color: "var(--color-warning-tint)",   textColor: "var(--color-warning)",         queries: 567,  isEnterpriseAgents: true },
  { name: "HR Assistant",   initials: "H", color: "var(--color-error-tint)",     textColor: "var(--color-error)",           queries: 289,  isEnterpriseAgents: false },
];

const TOP_NON_ENTERPRISE_AGENTS = AGENTS.filter(a => !a.isEnterpriseAgents).sort((a, b) => b.queries - a.queries);

interface Props {
  onEnable?: (agentName: string) => void;
}

export default function AnalyticsCallout({ onEnable }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
        {[
          { label: "Total queries", value: "6,833", icon: "ti-message" },
          { label: "Agents", value: "5", icon: "ti-robot" },
          { label: "Enterprise Agents", value: "3 / 5", icon: "ti-bolt" },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ flex: 1, padding: "var(--spacing-lg)", display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
              <i className={`ti ${stat.icon}`} style={{ fontSize: 14, color: "var(--text-muted)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{stat.label}</span>
            </div>
            <span style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)" }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Enterprise Agents upsell callout — for high-volume agents without Enterprise Agents */}
      <div style={{
        padding: "var(--spacing-lg)",
        background: "var(--brand-primary-tint)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(115,103,240,.18)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-md)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <i className="ti ti-bolt" style={{ color: "var(--brand-primary-default)", fontSize: 16, flexShrink: 0 }} />
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
            These agents could answer better with Enterprise Agents
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          {TOP_NON_ENTERPRISE_AGENTS.map(agent => (
            <div key={agent.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "var(--spacing-sm) var(--spacing-md)",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-default)",
              gap: "var(--spacing-md)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", minWidth: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "var(--radius-sm)",
                  background: agent.color, color: agent.textColor,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", flexShrink: 0,
                }}>
                  {agent.initials}
                </div>
                <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-body)" }}>
                  {agent.name}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", flexShrink: 0 }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                  {agent.queries.toLocaleString()} queries / mo
                </span>
                <button
                  onClick={() => onEnable?.(agent.name)}
                  className="btn btn-primary btn-sm"
                >
                  <i className="ti ti-bolt" />
                  Enable Enterprise Agents
                </button>
              </div>
            </div>
          ))}
        </div>

        <span style={{ fontSize: "var(--text-xs)", color: "var(--brand-primary-active)" }}>
          High-volume agents benefit most — more queries means more complex questions Enterprise Agents can handle better.
        </span>
      </div>

    </div>
  );
}
