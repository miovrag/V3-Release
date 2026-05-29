"use client";

import { useState } from "react";
import type { SuggestedActionsResult } from "@/lib/suggestedActions";

interface Props {
  result: SuggestedActionsResult;
  isExiting?: boolean;
  onDismissAll?: () => void;
}

export default function PostCreationRail({ result, isExiting = false, onDismissAll }: Props) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [dismissing, setDismissing] = useState<Set<number>>(new Set());

  const cards = result.cards;

  function dismiss(idx: number) {
    setDismissing(prev => new Set(prev).add(idx));
    setTimeout(() => {
      setDismissed(prev => {
        const next = new Set(prev).add(idx);
        if (next.size === cards.length) onDismissAll?.();
        return next;
      });
      setDismissing(prev => { const s = new Set(prev); s.delete(idx); return s; });
    }, 150);
  }

  const visible = cards.filter((_, i) => !dismissed.has(i));
  if (visible.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }} role="list">
      {cards.map((card, idx) => {
        if (dismissed.has(idx)) return null;
        const isDismissing = dismissing.has(idx);
        const isPrimary = card.priority === "primary";
        const entranceDelay = idx * 110;
        const exitDelay = idx * 45;

        return (
          <div
            key={idx}
            role="listitem"
            className={`action-card${isExiting ? " tip-slide-out" : " tip-slide-in"}${isDismissing ? " tip-exiting" : ""}`}
            style={{
              animationDelay: isExiting ? `${exitDelay}ms` : `${entranceDelay}ms`,
              display: "flex",
              alignItems: "flex-start",
              padding: isPrimary ? "11px 12px 11px 13px" : "8px 10px 8px 13px",
              borderRadius: "var(--radius-md)",
              background: isPrimary ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.72)",
              gap: 10,
              width: "100%",
            }}
          >
            {/* Intent icon */}
            <i
              className={`ti ${card.icon}`}
              style={{
                fontSize: isPrimary ? 15 : 14,
                color: "var(--brand-primary-active)",
                flexShrink: 0,
                marginTop: isPrimary ? 2 : 1,
              }}
            />

            {/* Text block */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: isPrimary ? 3 : 0 }}>
              <span style={{
                fontSize: isPrimary ? "var(--text-sm)" : "var(--text-xs)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--text-heading)",
                lineHeight: "var(--leading-tight)",
              }}>
                {card.title}
              </span>
              {isPrimary && (
                <span style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--text-muted)",
                  lineHeight: "var(--leading-normal)",
                }}>
                  {card.description}
                </span>
              )}
            </div>

            {/* CTA */}
            <a
              href={card.target_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", flexShrink: 0 }}
            >
              {isPrimary ? (
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent",
                  color: "var(--brand-primary-default)",
                  border: "1px solid var(--brand-primary-default)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-semibold)",
                  whiteSpace: "nowrap",
                  transition: "background var(--t-state), color var(--t-state)",
                }}>
                  {card.cta}
                </span>
              ) : (
                <span className="cta-btn">
                  <span>{card.cta}</span>
                  <span>→</span>
                </span>
              )}
            </a>

            {/* Per-card dismiss */}
            <button
              onClick={() => dismiss(idx)}
              aria-label="Dismiss"
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 4px",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-disabled)",
                display: "flex", alignItems: "center",
                flexShrink: 0,
                transition: "color var(--t-state)",
                marginTop: isPrimary ? 1 : 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-disabled)")}
            >
              <i className="ti ti-x" style={{ fontSize: 11 }} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
