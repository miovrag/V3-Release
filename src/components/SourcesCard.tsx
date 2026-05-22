"use client";

import { useState } from "react";

interface Source {
  name: string;
  url: string;
  domain: string;
}

interface SourcesCardProps {
  sources: Source[];
}

export default function SourcesCard({ sources }: SourcesCardProps) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("right");
  if (!sources.length) return null;

  const src = sources[idx];
  const total = sources.length;

  const go = (next: number, direction: "left" | "right") => {
    setDir(direction);
    setIdx(next);
  };

  return (
    <div style={{
      background: "#F5F5F5",
      borderRadius: 12,
      overflow: "hidden",
      fontSize: "var(--text-xs)",
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "10px 14px",
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
          <i className="ti ti-info-circle" style={{ fontSize: 14 }} />
          <span>Sources referenced in this response</span>
        </div>
        <span style={{ color: "var(--text-muted)", fontWeight: "var(--weight-medium)" }}>
          Reference {idx + 1}/{total}
        </span>
      </button>

      {/* Body */}
      {open && (
        <>
          <div style={{ height: 1, background: "var(--border-default)", margin: "0 14px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px" }}>
            <button
              onClick={() => go(Math.max(0, idx - 1), "left")}
              disabled={idx === 0}
              style={{
                background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer",
                color: idx === 0 ? "var(--border-emphasis)" : "var(--text-muted)",
                padding: "4px 6px", borderRadius: 6, fontSize: 14, flexShrink: 0,
                transition: "color 0.15s",
              }}
            >
              <i className="ti ti-chevron-left" />
            </button>

            {/* Animated content — key forces remount on each change */}
            <div
              key={idx}
              className={dir === "right" ? "source-enter-right" : "source-enter-left"}
              style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  color: "var(--brand-primary-default)",
                  textDecoration: "none", fontWeight: "var(--weight-medium)",
                }}
              >
                <i className="ti ti-file-text" style={{ fontSize: 13, flexShrink: 0 }} />
                <span style={{
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  textDecoration: "underline", textUnderlineOffset: 2,
                }}>
                  {src.name}
                </span>
                <i className="ti ti-arrow-up-right" style={{ fontSize: 12, flexShrink: 0 }} />
              </a>
              <span style={{ color: "var(--text-muted)", paddingLeft: 18 }}>{src.domain}</span>
            </div>

            <button
              onClick={() => go(Math.min(total - 1, idx + 1), "right")}
              disabled={idx === total - 1}
              style={{
                background: "none", border: "none", cursor: idx === total - 1 ? "default" : "pointer",
                color: idx === total - 1 ? "var(--border-emphasis)" : "var(--text-muted)",
                padding: "4px 6px", borderRadius: 6, fontSize: 14, flexShrink: 0,
                transition: "color 0.15s",
              }}
            >
              <i className="ti ti-chevron-right" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
