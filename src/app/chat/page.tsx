"use client";

import { useState, useRef, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";

const PRESETS = [
  { label: "Brand purple",  value: "#7367F0" },
  { label: "Brand active",  value: "#5C53C0" },
  { label: "Success",       value: "#28C76F" },
  { label: "Warning",       value: "#FF9F43" },
  { label: "Error",         value: "#EA5455" },
  { label: "Info",          value: "#00CFE8" },
  { label: "Heading",       value: "#171717" },
  { label: "Body",          value: "#404040" },
];

const VIDEO_PRESETS = [
  {
    id: "spline-cubic",
    label: "Cubic 3D",
    url: "https://my.spline.design/cubic-RH7OkaF0aXz8K9ihSxCrHKkb/",
    thumb: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
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

export default function ChatPage() {
  const [bgColor, setBgColor] = useState("#FAFAFA");
  const [showAvatar, setShowAvatar] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const lightBg = hexLuminance(bgColor) > 0.4;
  const iconColor = lightBg ? "var(--text-body)" : "#fff";
  const btnBg     = lightBg ? "rgba(0,0,0,0.08)"  : "rgba(255,255,255,0.15)";
  const btnBdr    = lightBg ? "rgba(0,0,0,0.15)"  : "rgba(255,255,255,0.3)";

  // Sync Safari / PWA theme-color with chat background
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "theme-color";
      document.head.appendChild(tag);
    }
    tag.content = bgColor;
  }, [bgColor]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <ChatWindow bgColor={bgColor} showAvatar={showAvatar} videoUrl={videoUrl} />

      {/* Floating colour picker */}
      <div ref={ref} style={{ position: "absolute", top: 16, right: 16, zIndex: 100 }}>
        <button
          onClick={() => setOpen(o => !o)}
          title="Chat background"
          style={{
            width: 36, height: 36,
            borderRadius: "var(--radius-full)",
            background: btnBg,
            border: `1px solid ${btnBdr}`,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: iconColor,
            transition: "background var(--t-state), color var(--t-state)",
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

            {/* Avatar toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Agent avatar</span>
              <button
                onClick={() => setShowAvatar(v => !v)}
                style={{
                  width: 36, height: 20, padding: 0,
                  borderRadius: "var(--radius-full)", border: "none", cursor: "pointer",
                  background: showAvatar ? "var(--brand-primary-default)" : "var(--border-emphasis)",
                  position: "relative",
                  transition: "background var(--t-state)",
                  flexShrink: 0,
                }}
                aria-label="Toggle agent avatar"
              >
                <span style={{
                  position: "absolute", top: 2,
                  left: showAvatar ? 18 : 2,
                  width: 16, height: 16,
                  borderRadius: "50%", background: "#fff",
                  transition: "left var(--t-state)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "var(--border-default)", margin: "0 -4px" }} />

            {/* Video background section */}
            <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--text-heading)" }}>
              Video background
            </span>
            <div style={{ display: "flex", gap: "var(--spacing-xs)" }}>
              {/* None swatch */}
              <button
                title="No video"
                onClick={() => setVideoUrl(null)}
                style={{
                  width: 40, height: 40,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-canvas)",
                  border: videoUrl === null
                    ? "2px solid var(--brand-primary-default)"
                    : "2px solid var(--border-default)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                  transition: "border-color var(--t-state)",
                  flexShrink: 0,
                }}
              >
                <i className="ti ti-ban" style={{ fontSize: 13 }} />
              </button>

              {VIDEO_PRESETS.map(v => (
                <button
                  key={v.id}
                  title={v.label}
                  onClick={() => setVideoUrl(v.url)}
                  style={{
                    width: 40, height: 40,
                    borderRadius: "var(--radius-sm)",
                    background: v.thumb,
                    border: videoUrl === v.url
                      ? "2px solid var(--brand-primary-default)"
                      : "2px solid transparent",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "border-color var(--t-state)",
                    flexShrink: 0,
                  }}
                >
                  <i className="ti ti-3d-cube-sphere" style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }} />
                </button>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
