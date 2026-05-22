"use client";

import { useState } from "react";

interface Tip {
  id: string;
  icon: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

const TIPS: Tip[] = [
  {
    id: "mcps",
    icon: "ti-plug-connected",
    title: "Connect your tools in Actions",
    description: "Link Slack, GitHub, HubSpot and more — your agent will act on real systems, not just reply.",
    cta: "Open Actions →",
    href: "https://agent-personalize.vercel.app",
  },
  {
    id: "persona",
    icon: "ti-user-circle",
    title: "Shape my voice in Persona",
    description: "Set my name, tone, and guardrails so every reply sounds exactly like your brand.",
    cta: "Open Persona →",
    href: "https://agent-personalize-persona-blue.vercel.app",
  },
  {
    id: "smart-tasks",
    icon: "ti-brain",
    title: "Automate responses in Intelligence",
    description: "Turn any answer into a recurring report — triggered on a schedule or by events.",
    cta: "Open Intelligence →",
    href: "https://agent-personalize-intelligence-eta.vercel.app",
  },
];

interface Props {
  onDismissAll?: () => void;
  bgColor?: string;
  isExiting?: boolean;
}

export default function PostCreationRail({ onDismissAll, isExiting = false }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());

  const visible = TIPS.filter(t => !dismissed.has(t.id));

  const dismiss = (id: string) => {
    setDismissing(prev => new Set(prev).add(id));
    setTimeout(() => {
      setDismissed(prev => {
        const next = new Set(prev).add(id);
        if (next.size === TIPS.length) onDismissAll?.();
        return next;
      });
      setDismissing(prev => { const s = new Set(prev); s.delete(id); return s; });
    }, 150);
  };

  if (visible.length === 0) return null;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
      role="complementary"
      aria-label="Getting started tips"
    >
      {visible.map((tip, idx) => {
        // bottom card = visible.length-1 → delay 0; top card = 0 → longest delay
        // entrance: bottom card first; exit: top card first
        const entranceDelay = (visible.length - 1 - idx) * 140;
        const exitDelay     = idx * 45;
        return (
          <div
            key={tip.id}
            className={`tip-row action-card${isExiting ? " tip-slide-out" : " tip-slide-in"}${dismissing.has(tip.id) ? " tip-exiting" : ""}`}
            style={{
              display: "flex",
              width: "100%",
              padding: "10px 14px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: 8,
              borderRadius: 8,
              background: "rgba(255,255,255,0.82)",
              animationDelay: isExiting ? `${exitDelay}ms` : `${entranceDelay}ms`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
              <i
                className={`ti ${tip.icon}`}
                style={{ fontSize: 16, color: "var(--brand-primary-active)", flexShrink: 0 }}
              />

              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
                  {tip.title}
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-body)", lineHeight: "var(--leading-normal)" }}>
                  {tip.description}
                </span>
              </div>

              <a
                href={tip.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn"
                style={{ flexShrink: 0, textDecoration: "none" }}
              >
                <span>{tip.cta.replace(" →", "")}</span>
                <span>→</span>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
