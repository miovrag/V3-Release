"use client";

import { useState, useRef, useEffect } from "react";
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <ChatWindow bgColor={bgColor} />

      {/* Floating colour picker */}
      <div ref={ref} style={{ position: "absolute", top: 16, right: 16, zIndex: 100 }}>
        <button
          onClick={() => setOpen(o => !o)}
          title="Chat background"
          style={{
            width: 36, height: 36,
            borderRadius: "var(--radius-full)",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#fff",
            transition: "background var(--t-state)",
          }}
        >
          <i className="ti ti-palette" style={{ fontSize: 16 }} />
        </button>

        {open && (
          <div style={{
            position: "absolute", top: 44, right: 0,
            width: 192,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-md)",
            display: "flex", flexDirection: "column", gap: "var(--spacing-sm)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}>
            <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
              Chat background
            </span>

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
                    cursor: "pointer", padding: 0,
                    transition: "border-color var(--t-state), box-shadow var(--t-state)",
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Custom</span>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  style={{ width: 28, height: 28, padding: 0, border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", background: "none" }}
                />
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", fontFamily: "ui-monospace, monospace", letterSpacing: "0.02em" }}>
                  {bgColor}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
