"use client";

import { useState, useEffect, useRef } from "react";

interface Tip {
  id: string;
  icon: string;
  title: string;
  description: string;
  cta: string;
}

const TIPS: Tip[] = [
  {
    id: "mcps",
    icon: "ti-plug-connected",
    title: "I can act, not just answer",
    description: "Connect me to Slack, GitHub, or your database — I'll take actions, not just give advice.",
    cta: "Connect tools →",
  },
  {
    id: "persona",
    icon: "ti-user-circle",
    title: "I can sound exactly like you",
    description: "Give me a tone, a name, and guardrails — every reply will feel like it came from your team.",
    cta: "Set my voice →",
  },
  {
    id: "smart-tasks",
    icon: "ti-calendar-event",
    title: "I can send this to you automatically",
    description: "Turn any question into a recurring report — daily, weekly, or whenever something changes.",
    cta: "Schedule it →",
  },
];

function hexLuminance(hex: string): number {
  const c = hex.replace("#", "");
  if (c.length !== 6) return 0;
  const toLinear = (x: number) =>
    x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  const r = toLinear(parseInt(c.slice(0, 2), 16) / 255);
  const g = toLinear(parseInt(c.slice(2, 4), 16) / 255);
  const b = toLinear(parseInt(c.slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

interface Props {
  onDismissAll?: () => void;
  bgColor?: string;
}

export default function PostCreationRail({ onDismissAll, bgColor = "#7367F0" }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());
  const [inView, setInView] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const light = hexLuminance(bgColor) > 0.4;
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

  const t = light ? {
    container:    "rgba(0,0,0,0.07)",
    border:       "1px solid rgba(0,0,0,0.1)",
    divider:      "1px solid rgba(0,0,0,0.07)",
    iconColor:    "var(--text-body)",
    title:        "var(--text-heading)",
    description:  "var(--text-muted)",
    dismissColor: "var(--text-muted)",
  } : {
    container:    "rgba(255,255,255,0.15)",
    border:       "1px solid rgba(255,255,255,0.18)",
    divider:      "1px solid rgba(255,255,255,0.1)",
    iconColor:    "#fff",
    title:        "#fff",
    description:  "rgba(255,255,255,0.65)",
    dismissColor: "rgba(255,255,255,0.45)",
  };

  return (
    <div
      ref={railRef}
      className={`rail-container${inView ? " rail-visible" : ""}`}
      style={{
        background: t.container,
        border: t.border,
        borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
        overflow: "hidden",
      }}
      role="complementary"
      aria-label="Getting started tips"
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {visible.map((tip, i) => (
          <div
            key={tip.id}
            className={`tip-row${dismissing.has(tip.id) ? " tip-exiting" : ""}${light ? " tip-row-light" : ""}`}
            style={{
              display: "flex", alignItems: "flex-start", gap: "var(--spacing-sm)",
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderBottom: i < visible.length - 1 ? t.divider : "none",
            }}
          >
            {/* Icon */}
            <i className={`ti ${tip.icon}`} style={{ fontSize: 18, color: t.iconColor, flexShrink: 0, marginTop: 1 }} />

            {/* Title + description */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: t.title }}>
                {tip.title}
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: t.description, lineHeight: "var(--leading-normal)" }}>
                {tip.description}
              </span>
            </div>

            {/* CTA */}
            <button
              style={{
                flexShrink: 0, whiteSpace: "nowrap",
                background: "none", border: "none", padding: 0,
                fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
                color: light ? "var(--brand-primary-default)" : "#fff",
                cursor: "pointer", fontFamily: "inherit",
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
