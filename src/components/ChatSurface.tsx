"use client";

import { useState } from "react";
import PostCreationRail from "./PostCreationRail";

type View = "empty" | "response";

interface Props {
  isNextGen?: boolean;
  plan?: "standard" | "premium" | "enterprise";
  onUpgrade?: () => void;
}

const MOCK_QUESTION = "What are our top 3 cancellation reasons and how do they compare to last quarter?";
const MOCK_ANSWER_STANDARD = "Based on your knowledge base, the top cancellation reasons are: 1) Pricing (34%), 2) Missing features (28%), 3) Switching to competitor (21%). I don't have last quarter's data available to make a direct comparison.";
const MOCK_ANSWER_NEXTGEN  = "I analysed your support tickets, CRM export, and last quarter's churn report across 3 reasoning steps:\n\n**Top 3 cancellation reasons this quarter:**\n1. Pricing — 34% (↑8pp vs Q4, driven by plan price increase in Jan)\n2. Missing features — 28% (stable, same feature gaps: bulk export, SSO)\n3. Competitor switch — 21% (↓4pp, mostly to Intercom)\n\n**Key shift vs last quarter:** Pricing complaints nearly doubled following the January repricing. Feature gap complaints remained flat, suggesting the roadmap is holding retention there.";

export default function ChatSurface({ isNextGen = false, plan = "standard", onUpgrade }: Props) {
  const [view, setView] = useState<View>("empty");
  const [railKey, setRailKey] = useState(0);

  const PLAN_LABEL = { standard: "Standard", premium: "Premium", enterprise: "Enterprise" }[plan];

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>

      {/* Chat header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--spacing-md) var(--spacing-lg)",
        borderBottom: "1px solid var(--border-default)",
        background: "var(--bg-surface)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "var(--radius-md)",
            background: "var(--brand-primary-tint)", color: "var(--brand-primary-default)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)", flexShrink: 0,
          }}>S</div>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
            Support Agent
          </span>
        </div>
        {/* View toggle for demo */}
        <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
          {(["empty", "response"] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`btn btn-xs ${view === v ? "btn-primary" : "btn-ghost"}`}
            >
              {v === "empty" ? "Empty state" : "After response"}
            </button>
          ))}
          {view === "response" && (
            <button
              onClick={() => setRailKey(k => k + 1)}
              className="btn btn-xs btn-ghost"
              title="Reset post-creation rail"
            >
              <i className="ti ti-refresh" style={{ fontSize: 12 }} />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div style={{ minHeight: 240, padding: "var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-lg)", background: "var(--bg-canvas)" }}>

        {view === "empty" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--spacing-lg)", textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "var(--radius-md)",
              background: "var(--brand-primary-tint)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="ti ti-message" style={{ fontSize: 24, color: "var(--brand-primary-default)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
                Ask anything
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", maxWidth: 280 }}>
                Try a simple question or a complex multi-part question
              </span>
            </div>

            {/* Hint for non-NextGen */}
            {!isNextGen && (
              <div style={{
                display: "flex", alignItems: "center", gap: "var(--spacing-sm)",
                padding: "var(--spacing-sm) var(--spacing-md)",
                background: "var(--brand-primary-tint)",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(115,103,240,.15)",
              }}>
                <i className="ti ti-bolt" style={{ color: "var(--brand-primary-default)", fontSize: 13 }} />
                <span style={{ fontSize: "var(--text-xs)", color: "var(--brand-primary-active)" }}>
                  Enable NextGen for multi-step reasoning
                </span>
                <button
                  onClick={onUpgrade}
                  style={{
                    background: "none", border: "none", padding: 0, cursor: "pointer",
                    fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
                    color: "var(--brand-primary-default)", fontFamily: "inherit",
                  }}
                >
                  Enable →
                </button>
              </div>
            )}
          </div>
        )}

        {view === "response" && (
          <>
            {/* User message */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                maxWidth: "75%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                background: "var(--brand-primary-default)",
                color: "#fff",
                borderRadius: "var(--radius-lg) var(--radius-lg) var(--spacing-xs) var(--radius-lg)",
                fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
              }}>
                {MOCK_QUESTION}
              </div>
            </div>

            {/* Agent response */}
            <div style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "flex-start" }}>
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                borderRadius: "var(--radius-md)",
                background: "var(--brand-primary-tint)", color: "var(--brand-primary-default)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)",
              }}>S</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                <div style={{
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--spacing-xs)",
                  border: "1px solid var(--border-default)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    padding: "var(--spacing-md)",
                    fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
                    color: "var(--text-body)",
                    whiteSpace: "pre-line",
                  }}>
                    {isNextGen ? MOCK_ANSWER_NEXTGEN : MOCK_ANSWER_STANDARD}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    borderTop: "1px solid var(--border-default)",
                    background: "var(--bg-canvas)",
                  }}>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      {isNextGen
                        ? <><i className="ti ti-bolt" style={{ color: "var(--brand-primary-default)", fontSize: 12 }} />Powered by NextGen · {PLAN_LABEL}</>
                        : <>Powered by Standard</>
                      }
                    </span>
                    {!isNextGen && (
                      <button
                        onClick={onUpgrade}
                        style={{
                          background: "none", border: "none", padding: 0, cursor: "pointer",
                          fontSize: "var(--text-xs)", fontWeight: "var(--weight-medium)",
                          color: "var(--brand-primary-default)", fontFamily: "inherit",
                        }}
                      >
                        Upgrade to NextGen →
                      </button>
                    )}
                  </div>
                </div>

                {/* Contextual hint — Standard only */}
                {!isNextGen && (
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: "var(--spacing-sm)",
                    padding: "var(--spacing-sm) var(--spacing-md)",
                    background: "var(--brand-primary-tint)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(115,103,240,.15)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                      <i className="ti ti-bolt" style={{ color: "var(--brand-primary-default)", fontSize: 14, flexShrink: 0 }} />
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--brand-primary-active)", lineHeight: "var(--leading-relaxed)" }}>
                        NextGen could cross-reference multiple sources and compare quarters automatically.
                      </span>
                    </div>
                    <button
                      onClick={onUpgrade}
                      style={{
                        background: "none", border: "none", padding: 0, cursor: "pointer",
                        fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
                        color: "var(--brand-primary-default)", fontFamily: "inherit",
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}
                    >
                      Enable →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post-creation discovery rail */}
            <PostCreationRail key={railKey} />
          </>
        )}
      </div>

    </div>
  );
}
