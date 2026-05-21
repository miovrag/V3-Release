"use client";
import { useState } from "react";

interface Agent {
  id: number;
  name: string;
  desc: string;
  queries: number;
  initials: string;
  color: string;
  textColor: string;
}

const AGENTS: Agent[] = [
  { id: 1, name: "Support Agent",  desc: "Customer support — handles billing, bugs, how-to",  queries: 1842, initials: "S", color: "var(--brand-primary-tint)",  textColor: "var(--brand-primary-default)" },
  { id: 2, name: "Sales Copilot",  desc: "Lead qualification and pricing objections",           queries: 934,  initials: "S", color: "var(--color-info-tint)",      textColor: "var(--color-info)"            },
  { id: 3, name: "Research Hub",   desc: "Deep research across all connected sources",           queries: 567,  initials: "R", color: "var(--color-warning-tint)", textColor: "var(--color-warning)"          },
];

export default function MultiAgentAgentsList() {
  const [primaryId, setPrimaryId] = useState<number>(1);
  const [justChanged, setJustChanged] = useState<number | null>(null);

  function handleSetPrimary(id: number) {
    setPrimaryId(id);
    setJustChanged(id);
    setTimeout(() => setJustChanged(null), 1600);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
      {/* Context callout */}
      <div className="alert alert-primary">
        <i className="ti ti-sitemap" style={{ marginTop: 1 }} />
        <div>
          <span style={{ fontWeight: "var(--weight-semibold)" }}>Primary agent </span>
          receives every user message first and decides how to respond — or route to another agent. Only one agent can be primary.
        </div>
      </div>

      {/* Card */}
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
            Add agent
          </button>
        </div>

        {/* Rows */}
        {AGENTS.map((agent, i) => {
          const isPrimary = agent.id === primaryId;
          const isNew     = agent.id === justChanged;
          return (
            <div
              key={agent.id}
              style={{
                display: "flex", alignItems: "center",
                gap: "var(--spacing-md)",
                padding: "var(--spacing-md) var(--spacing-xl)",
                borderBottom: i < AGENTS.length - 1 ? "1px solid var(--border-default)" : "none",
                background: isPrimary ? "var(--brand-primary-tint)" : "var(--bg-surface)",
                transition: "background var(--t-entry)",
              }}
            >
              {/* Primary radio indicator */}
              <div
                onClick={() => !isPrimary && handleSetPrimary(agent.id)}
                title={isPrimary ? "Primary agent" : "Set as primary"}
                style={{
                  width: 20, height: 20,
                  borderRadius: "var(--radius-full)",
                  border: `2px solid ${isPrimary ? "var(--brand-primary-default)" : "var(--border-emphasis)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  cursor: isPrimary ? "default" : "pointer",
                  transition: "border-color var(--t-state)",
                }}
              >
                {isPrimary && (
                  <div style={{
                    width: 10, height: 10,
                    borderRadius: "var(--radius-full)",
                    background: "var(--brand-primary-default)",
                    animation: isNew ? "pop-in 200ms cubic-bezier(.2,.7,.3,1) both" : "none",
                  }} />
                )}
              </div>

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
                  <span style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--weight-semibold)",
                    color: isPrimary ? "var(--brand-primary-active)" : "var(--text-heading)",
                  }}>
                    {agent.name}
                  </span>
                  {isPrimary && (
                    <span className="badge badge-primary" style={{ animation: isNew ? "pop-in 220ms cubic-bezier(.2,.7,.3,1) both" : "none" }}>
                      <i className="ti ti-crown" style={{ fontSize: 10 }} />
                      Primary
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: "var(--text-xs)",
                  color: isPrimary ? "var(--brand-primary-default)" : "var(--text-muted)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
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

              {/* Set as primary button — only on non-primary rows */}
              <div style={{ width: 112, flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
                {!isPrimary && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleSetPrimary(agent.id)}
                  >
                    Set as primary
                  </button>
                )}
              </div>

              <i className="ti ti-chevron-right" style={{ color: "var(--border-emphasis)", fontSize: 16, flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
