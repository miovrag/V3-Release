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
    iconColor: "var(--brand-primary-default)",
    iconBg: "var(--brand-primary-tint)",
    title: "Connect real-world tools",
    description: "Give your agent access to Slack, GitHub, databases, and more. MCPs turn chat into action.",
    cta: "Add MCPs →",
  },
  {
    id: "persona",
    icon: "ti-user-circle",
    iconColor: "var(--color-success)",
    iconBg: "var(--color-success-tint)",
    title: "Make it sound like you",
    description: "Set tone, name, response style, and guardrails so every reply feels on-brand.",
    cta: "Set persona →",
  },
  {
    id: "smart-tasks",
    icon: "ti-calendar-event",
    iconColor: "var(--color-warning)",
    iconBg: "var(--color-warning-tint)",
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
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--spacing-md) var(--spacing-lg)",
        borderBottom: "1px solid var(--border-default)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <i className="ti ti-sparkles" style={{ fontSize: "var(--text-sm)", color: "var(--brand-primary-default)" }} />
          <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
            Unlock more from your agent
          </span>
          <span className="badge badge-default">
            {visible.length} tip{visible.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button className="btn-link" onClick={dismissAll} style={{ fontSize: "var(--text-xs)" }}>
          Dismiss all
        </button>
      </div>

      {/* Tip rows */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {visible.map((tip, i) => (
          <div
            key={tip.id}
            style={{
              display: "flex", alignItems: "flex-start", gap: "var(--spacing-md)",
              padding: "var(--spacing-lg)",
              borderBottom: i < visible.length - 1 ? "1px solid var(--border-default)" : "none",
            }}
          >
            {/* Icon */}
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              borderRadius: "var(--radius-md)",
              background: tip.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className={`ti ${tip.icon}`} style={{ fontSize: "var(--text-lg)", color: tip.iconColor }} />
            </div>

            {/* Text + CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)", flex: 1 }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
                {tip.title}
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)" }}>
                {tip.description}
              </span>
              <button className="btn-link" style={{ fontSize: "var(--text-xs)", marginTop: "var(--spacing-xs)" }}>
                {tip.cta}
              </button>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => dismiss(tip.id)}
              aria-label={`Dismiss ${tip.title}`}
              style={{
                flexShrink: 0,
                fontSize: "var(--text-sm)", color: "var(--text-muted)",
                lineHeight: 1, padding: 0,
              }}
            >
              <i className="ti ti-x" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
