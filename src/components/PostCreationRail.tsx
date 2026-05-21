"use client";

import { useState } from "react";

interface Tip {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  cta: string;
}

const TIPS: Tip[] = [
  {
    id: "mcps",
    icon: "ti-plug-connected",
    iconColor: "#7367F0",
    iconBg: "#EAE8FD",
    title: "Connect real-world tools",
    description: "Give your agent access to Slack, GitHub, databases, and more. MCPs turn chat into action.",
    cta: "Add MCPs →",
  },
  {
    id: "persona",
    icon: "ti-user-circle",
    iconColor: "#28C76F",
    iconBg: "#E8F8EF",
    title: "Make it sound like you",
    description: "Set tone, name, response style, and guardrails so every reply feels on-brand.",
    cta: "Set persona →",
  },
  {
    id: "smart-tasks",
    icon: "ti-calendar-event",
    iconColor: "#FF9F43",
    iconBg: "#FFF3E5",
    title: "Automate with Smart Tasks",
    description: "Turn any question into a scheduled task — reports, summaries, or alerts on autopilot.",
    cta: "Try Smart Tasks →",
  },
];

interface Props {
  onDismissAll?: () => void;
}

export default function PostCreationRail({ onDismissAll }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = TIPS.filter(t => !dismissed.has(t.id));

  const dismiss = (id: string) => {
    const next = new Set(dismissed).add(id);
    setDismissed(next);
    if (next.size === TIPS.length) onDismissAll?.();
  };

  const dismissAll = () => {
    setDismissed(new Set(TIPS.map(t => t.id)));
    onDismissAll?.();
  };

  if (visible.length === 0) return null;

  return (
    <div style={{
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)",
      background: "var(--bg-surface)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--spacing-md) var(--spacing-lg)",
        borderBottom: "1px solid var(--border-default)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <i className="ti ti-sparkles" style={{ fontSize: 14, color: "var(--brand-primary-default)" }} />
          <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
            Unlock more from your agent
          </span>
          <span style={{
            fontSize: "var(--text-xs)", color: "var(--text-muted)",
            background: "var(--bg-selected)",
            borderRadius: "var(--radius-full)",
            padding: "1px 7px",
          }}>
            {visible.length} tip{visible.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={dismissAll}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "inherit",
          }}
        >
          Dismiss all
        </button>
      </div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${visible.length}, 1fr)`,
        gap: 0,
      }}>
        {visible.map((tip, i) => (
          <div
            key={tip.id}
            style={{
              padding: "var(--spacing-lg)",
              borderRight: i < visible.length - 1 ? "1px solid var(--border-default)" : "none",
              display: "flex", flexDirection: "column", gap: "var(--spacing-sm)",
              position: "relative",
            }}
          >
            {/* Dismiss × */}
            <button
              onClick={() => dismiss(tip.id)}
              aria-label={`Dismiss ${tip.title}`}
              style={{
                position: "absolute", top: "var(--spacing-md)", right: "var(--spacing-md)",
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontSize: 13, color: "var(--text-muted)", lineHeight: 1,
                fontFamily: "inherit",
              }}
            >
              <i className="ti ti-x" />
            </button>

            {/* Icon */}
            <div style={{
              width: 36, height: 36,
              borderRadius: "var(--radius-md)",
              background: tip.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <i className={`ti ${tip.icon}`} style={{ fontSize: 18, color: tip.iconColor }} />
            </div>

            {/* Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)", flex: 1 }}>
              <span style={{
                fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)",
                paddingRight: "var(--spacing-xl)",
              }}>
                {tip.title}
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)" }}>
                {tip.description}
              </span>
            </div>

            {/* CTA */}
            <button
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
                color: "var(--brand-primary-default)", fontFamily: "inherit",
                textAlign: "left",
              }}
            >
              {tip.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
