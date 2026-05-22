"use client";

import { useState, useEffect, useRef } from "react";
import PostCreationRail from "./PostCreationRail";

type Phase = "idle" | "typing" | "responded";

interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
}

const AGENT_INITIAL = "S";
const AGENT_NAME = "Support Agent";

const STARTER_QUESTIONS = [
  "How do I connect my tools?",
  "How do I set a persona?",
  "How do Smart Tasks work?",
];

const MOCK_ANSWER =
  "Connecting tools to your agent takes just a few steps:\n\n**1. Open the Actions tab** in your agent builder and click 'Add integration'\n\n**2. Pick from 100+ integrations** — Slack, Gmail, HubSpot, GitHub, Notion, and more\n\n**3. Set permissions** — decide exactly which actions your agent can take\n\nOnce connected, your agent can send Slack messages, create tasks, update CRM records — not just answer questions.";

const BUBBLE_STYLE = {
  display: "flex",
  width: 574,
  padding: "16px",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "flex-start" as const,
  gap: 8,
  borderRadius: 8,
  background: "#FFF",
};

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

interface ChatWindowProps {
  bgColor?: string;
}

export default function ChatWindow({ bgColor = "#7367F0" }: ChatWindowProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [railKey, setRailKey] = useState(0);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamedChars, setStreamedChars] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const lightBg = hexLuminance(bgColor) > 0.4;

  // Contrast-aware tokens
  const textOnBg    = lightBg ? "var(--text-body)"      : "#fff";
  const dimTextOnBg = lightBg ? "rgba(0,0,0,0.35)"      : "rgba(255,255,255,0.4)";
  const labelColor  = lightBg ? "var(--text-muted)"     : "rgba(255,255,255,0.45)";
  const avatarBg    = lightBg ? "rgba(0,0,0,0.10)"      : "rgba(255,255,255,0.25)";
  const userMsgBg   = lightBg ? "rgba(0,0,0,0.08)"      : "rgba(255,255,255,0.2)";
  const glassBtnBg  = lightBg ? "rgba(0,0,0,0.08)"      : "rgba(255,255,255,0.15)";
  const glassBtnBdr = lightBg ? "rgba(0,0,0,0.15)"      : "rgba(255,255,255,0.3)";
  const sendActiveBg = lightBg ? "rgba(0,0,0,0.15)"     : "rgba(255,255,255,0.9)";
  const sendIdleBg   = lightBg ? "rgba(0,0,0,0.06)"     : "rgba(255,255,255,0.15)";

  const showSuggestions = phase === "responded" && streamingId === null;
  const bottomPanelHeight = showSuggestions ? 340 : 72;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  useEffect(() => {
    if (!streamingId) return;
    const msg = messages.find(m => m.id === streamingId);
    if (!msg) return;
    if (streamedChars >= msg.text.length) {
      setStreamingId(null);
      return;
    }
    const t = setTimeout(() => setStreamedChars(c => Math.min(c + 2, msg.text.length)), 12);
    return () => clearTimeout(t);
  }, [streamingId, streamedChars, messages]);

  const send = (text: string) => {
    if (phase === "typing" || !text.trim()) return;
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setInput("");
    setPhase("typing");
    setTimeout(() => {
      const id = `a-${Date.now()}`;
      setMessages(prev => [...prev, { id, role: "agent", text: MOCK_ANSWER }]);
      setPhase("responded");
      setStreamingId(id);
      setStreamedChars(0);
    }, 5000);
  };

  const reset = () => {
    setPhase("idle");
    setMessages([]);
    setRailKey(k => k + 1);
    setStreamingId(null);
    setStreamedChars(0);
  };

  const avatarStyle = {
    width: 28, height: 28, flexShrink: 0 as const,
    borderRadius: "var(--radius-full)",
    background: avatarBg, color: textOnBg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)" as const,
  };

  return (
    <div style={{
      position: "relative",
      display: "flex", flexDirection: "column",
      height: "100vh",
      background: bgColor,
      overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <div style={{ flexShrink: 0 }}>
        <div style={{
          maxWidth: 756, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "var(--spacing-md) var(--spacing-lg)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
            <div style={{ ...avatarStyle, width: 32, height: 32, fontSize: "var(--text-sm)" }}>
              {AGENT_INITIAL}
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: textOnBg }}>
              {AGENT_NAME}
            </span>
          </div>
          {phase === "responded" && (
            <button
              onClick={reset}
              style={{
                background: glassBtnBg, border: `1px solid ${glassBtnBdr}`,
                borderRadius: "var(--radius-md)", padding: "var(--spacing-xs) var(--spacing-sm)",
                color: textOnBg, fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: "var(--spacing-xs)",
                transition: "background var(--t-state)",
              }}
            >
              <i className="ti ti-refresh" style={{ fontSize: 12 }} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto", isolation: "isolate" }}>
        <div style={{
          maxWidth: 756, margin: "0 auto",
          padding: `var(--spacing-md) var(--spacing-lg) ${bottomPanelHeight + 24}px`,
          display: "flex", flexDirection: "column", gap: "var(--spacing-md)",
          justifyContent: phase === "idle" ? "center" : "flex-start",
          alignItems: phase === "idle" ? "center" : "stretch",
          minHeight: "100%",
        }}>

          {messages.map(msg =>
            msg.role === "user" ? (
              <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  maxWidth: "75%",
                  padding: "var(--spacing-sm) var(--spacing-md)",
                  background: userMsgBg,
                  color: textOnBg,
                  borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)",
                  fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
                }}>
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={msg.id} style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", minWidth: 0 }}>
                  <div style={BUBBLE_STYLE}>
                    <div style={{
                      fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
                      color: "var(--text-body)", whiteSpace: "pre-line", width: "100%",
                    }}>
                      {msg.id === streamingId ? msg.text.slice(0, streamedChars) : msg.text}
                      {msg.id === streamingId && <span className="stream-cursor" />}
                    </div>
                    {msg.id !== streamingId && (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 4,
                        borderTop: "1px solid var(--border-default)",
                        paddingTop: "var(--spacing-sm)", width: "100%",
                        fontSize: "var(--text-xs)", color: "var(--text-muted)",
                      }}>
                        <i className="ti ti-bolt" style={{ fontSize: 12, color: "var(--brand-primary-default)" }} />
                        Powered by Enterprise Agents
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Typing indicator */}
          {phase === "typing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "var(--spacing-xs)",
                padding: "12px 16px", borderRadius: 8, background: "#FFF",
              }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <span style={{ fontSize: "var(--text-xs)", color: dimTextOnBg, paddingLeft: 4 }}>
                CustomGPT.ai can make mistakes. Always check your answers.
              </span>
            </div>
          )}

          {/* Starter question cards */}
          {phase === "idle" && messages.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
              {STARTER_QUESTIONS.map(q => (
                <button
                  key={q}
                  className="action-card"
                  onClick={() => send(q)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", padding: "16px",
                    borderRadius: 8, background: "rgba(255,255,255,0.82)",
                    fontFamily: "inherit", textAlign: "left", cursor: "pointer",
                  }}
                >
                  <i className="ti ti-message-question" style={{ fontSize: 16, color: "var(--brand-primary-active)", flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: "var(--text-sm)", color: "var(--text-body)", fontWeight: "var(--weight-medium)" }}>
                    {q}
                  </span>
                  <span style={{ color: "var(--text-body)", fontSize: 14, flexShrink: 0 }}>→</span>
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Floating bottom panel: suggestions + input ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30 }}>
        <div style={{
          maxWidth: 756, margin: "0 auto",
          padding: "0 var(--spacing-lg) var(--spacing-md)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>

          {showSuggestions && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
                <i className="ti ti-bulb" style={{ fontSize: 11, color: labelColor }} />
                <span className="shimmer-label" style={{ fontSize: "var(--text-xs)", color: labelColor, fontWeight: "var(--weight-medium)" }}>
                  Your agent can do even more
                </span>
              </div>
              <PostCreationRail key={railKey} bgColor={bgColor} />
            </>
          )}

          <div style={{ position: "relative" }}>
            <input
              className={`chat-input${lightBg ? " chat-input-light" : ""}`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(input); }}
              placeholder="Ask anything…"
              disabled={phase === "typing"}
              style={{ width: "100%", paddingRight: 52, boxSizing: "border-box" }}
            />
            <button
              onClick={() => send(input)}
              disabled={phase === "typing" || !input.trim()}
              style={{
                position: "absolute", right: 6, top: "50%",
                transform: "translateY(-50%)",
                width: 32, height: 32,
                borderRadius: "var(--radius-full)",
                background: input.trim() && phase !== "typing" ? sendActiveBg : sendIdleBg,
                border: "none",
                cursor: input.trim() && phase !== "typing" ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background var(--t-state)",
                color: "var(--brand-primary-default)",
              }}
            >
              <i className="ti ti-send" style={{ fontSize: 15 }} />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
