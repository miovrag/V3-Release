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
    description: "Connect me to Slack, GitHub, or your CRM — I'll take actions, not just give advice.",
    cta: "Add integrations →",
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

interface Props {
  onDismissAll?: () => void;
  bgColor?: string;
}

export default function PostCreationRail({ onDismissAll }: Props) {
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
      ref={railRef}
      className={`rail-container${inView ? " rail-visible" : ""}`}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
      role="complementary"
      aria-label="Getting started tips"
    >
      {visible.map((tip) => (
        <div
          key={tip.id}
          className={`tip-row action-card${dismissing.has(tip.id) ? " tip-exiting" : ""}`}
          style={{
            display: "flex",
            width: 574,
            padding: "8px 16px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 8,
            borderRadius: 8,
            background: "rgba(255,255,255,0.22)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <i
              className={`ti ${tip.icon}`}
              style={{ fontSize: 16, color: "var(--brand-primary-default)", flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
                {tip.title}
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: "var(--leading-normal)" }}>
                {tip.description}
              </span>
            </div>

            <button className="cta-btn" style={{ flexShrink: 0 }}>
              <span>{tip.cta.replace(" →", "")}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
