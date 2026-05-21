"use client";

import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";

const PRESETS = [
  { label: "Brand purple",  value: "#7367F0" },
  { label: "Deep navy",     value: "#1e2a4a" },
  { label: "Forest",        value: "#1b4332" },
  { label: "Midnight",      value: "#0f0f1a" },
  { label: "Ocean",         value: "#0369a1" },
  { label: "Rose",          value: "#9f1239" },
  { label: "Slate",         value: "#334155" },
  { label: "Graphite",      value: "#27272a" },
];

export default function ChatPage() {
  const [bgColor, setBgColor] = useState("#7367F0");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{
        height: 56, flexShrink: 0,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
        display: "flex", alignItems: "center",
        padding: "0 var(--spacing-xl)", gap: "var(--spacing-sm)",
      }}>
        <i className="ti ti-robot" style={{ fontSize: 20, color: "var(--brand-primary-default)" }} />
        <span style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)" }}>
          CustomGPT.ai
        </span>
        <span className="badge badge-primary" style={{ marginLeft: "var(--spacing-xs)" }}>
          Post-creation flow
        </span>
      </header>

      {/* Chat + picker */}
      <main style={{
        flex: 1,
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        padding: "var(--spacing-xl)",
        gap: "var(--spacing-xl)",
      }}>
        {/* Chat window */}
        <div style={{ width: "100%", maxWidth: 520 }}>
          <ChatWindow bgColor={bgColor} />
        </div>

        {/* Color picker panel */}
        <div style={{
          flexShrink: 0, width: 180,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--spacing-md)",
          display: "flex", flexDirection: "column", gap: "var(--spacing-sm)",
          position: "sticky", top: "var(--spacing-xl)",
        }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
            Chat background
          </span>

          {/* Swatches */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-xs)" }}>
            {PRESETS.map(p => (
              <button
                key={p.value}
                title={p.label}
                onClick={() => setBgColor(p.value)}
                style={{
                  width: 28, height: 28,
                  borderRadius: "var(--radius-sm)",
                  background: p.value,
                  border: bgColor === p.value
                    ? "2px solid var(--brand-primary-default)"
                    : "2px solid transparent",
                  boxShadow: bgColor === p.value ? "0 0 0 1px #fff inset" : "none",
                  cursor: "pointer",
                  transition: "border-color var(--t-state), box-shadow var(--t-state)",
                  padding: 0,
                }}
              />
            ))}
          </div>

          {/* Custom color input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Custom</span>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
              <input
                type="color"
                value={bgColor}
                onChange={e => setBgColor(e.target.value)}
                style={{
                  width: 28, height: 28, padding: 0, border: "none",
                  borderRadius: "var(--radius-sm)", cursor: "pointer",
                  background: "none",
                }}
              />
              <span style={{
                fontSize: "var(--text-xs)", color: "var(--text-muted)",
                fontFamily: "ui-monospace, monospace", letterSpacing: "0.02em",
              }}>
                {bgColor}
              </span>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
