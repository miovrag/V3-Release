"use client";

import { useState, useEffect, useRef } from "react";
import PostCreationRail from "./PostCreationRail";
import SourcesCard from "./SourcesCard";

type Phase = "idle" | "typing" | "responded";

interface Source {
  name: string;
  url: string;
  domain: string;
}

interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
  sources?: Source[];
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

const MOCK_SOURCES: Source[] = [
  { name: "Integrations Setup Guide 2025.pdf", url: "#", domain: "app.customgpt.ai" },
  { name: "Actions & Permissions Overview.pdf", url: "#", domain: "app.customgpt.ai" },
  { name: "Agent Builder Documentation.pdf",   url: "#", domain: "app.customgpt.ai" },
];

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
  showAvatar?: boolean;
}

export default function ChatWindow({ bgColor = "#FAFAFA", showAvatar = true }: ChatWindowProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [railKey, setRailKey] = useState(0);
  const [railDismissed, setRailDismissed] = useState(false);
  const [railExiting, setRailExiting] = useState(false);
  const [disclaimerSeen, setDisclaimerSeen] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamedChars, setStreamedChars] = useState(0);
  const [reactions, setReactions] = useState<Record<string, "up" | "down" | null>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bottomVisible, setBottomVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCopy = (msg: Message) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(id => id === msg.id ? null : id), 1800);
  };

  const handleReaction = (id: string, vote: "up" | "down") => {
    setReactions(prev => ({ ...prev, [id]: prev[id] === vote ? null : vote }));
  };

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

  const showSuggestions = (!railDismissed && phase === "responded" && streamingId === null && bottomVisible) || railExiting;
  const bottomPanelHeight = showSuggestions ? 340 : 72;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setBottomVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

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
    if (showSuggestions) {
      setRailExiting(true);
      setTimeout(() => { setRailDismissed(true); setRailExiting(false); }, 600);
    }
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setInput("");
    setPhase("typing");
    setTimeout(() => {
      const id = `a-${Date.now()}`;
      setMessages(prev => [...prev, { id, role: "agent", text: MOCK_ANSWER, sources: MOCK_SOURCES }]);
      setPhase("responded");
      setStreamingId(id);
      setStreamedChars(0);
      setDisclaimerSeen(true);
    }, 5000);
  };

  const reset = () => {
    setPhase("idle");
    setMessages([]);
    setRailKey(k => k + 1);
    setRailDismissed(false);
    setRailExiting(false);
    setDisclaimerSeen(false);
    setStreamingId(null);
    setStreamedChars(0);
    setBottomVisible(false);
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
      background: lightBg
        ? `linear-gradient(178deg, #ffffff 0%, ${bgColor} 100%)`
        : bgColor,
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
            {showAvatar && (
              <div style={{ ...avatarStyle, width: 32, height: 32, fontSize: "var(--text-sm)" }}>
                {AGENT_INITIAL}
              </div>
            )}
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
              <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                {showAvatar && (
                  <div style={{ ...avatarStyle, marginTop: 2 }}>{AGENT_INITIAL}</div>
                )}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", minWidth: 0, maxWidth: 574 }}>
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
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        borderTop: "1px solid var(--border-default)",
                        paddingTop: "var(--spacing-sm)", width: "100%",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                          {[
                            { key: "copy", icon: copiedId === msg.id ? "ti-check" : "ti-copy", onClick: () => handleCopy(msg), active: copiedId === msg.id },
                            { key: "up",   icon: reactions[msg.id] === "up"   ? "ti-thumb-up-filled"   : "ti-thumb-up",   onClick: () => handleReaction(msg.id, "up"),   active: reactions[msg.id] === "up" },
                            { key: "down", icon: reactions[msg.id] === "down" ? "ti-thumb-down-filled" : "ti-thumb-down", onClick: () => handleReaction(msg.id, "down"), active: reactions[msg.id] === "down" },
                          ].map(btn => (
                            <button key={btn.key} onClick={btn.onClick} style={{
                              background: "none", border: "none", cursor: "pointer",
                              padding: "4px 5px", borderRadius: 6,
                              color: btn.active ? "var(--brand-primary-default)" : "var(--text-muted)",
                              fontSize: 15, display: "flex", alignItems: "center",
                              transition: "color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                            >
                              <i className={`ti ${btn.icon}`} />
                            </button>
                          ))}
                          <div style={{ width: 1, height: 14, background: "var(--border-default)", margin: "0 3px" }} />
                          <button style={{
                            background: "none", border: "none", cursor: "pointer",
                            padding: "4px 5px", borderRadius: 6,
                            color: "var(--text-muted)", fontSize: 15,
                            display: "flex", alignItems: "center",
                            transition: "color 0.15s, background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >
                            <i className="ti ti-shield-check" />
                          </button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                          <i className="ti ti-bolt" style={{ fontSize: 12, color: "var(--brand-primary-default)" }} />
                          Powered by Enterprise Agents
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.id !== streamingId && msg.sources && msg.sources.length > 0 && (
                    <SourcesCard sources={msg.sources} />
                  )}
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
              {!disclaimerSeen && (
                <span style={{ fontSize: "var(--text-xs)", color: dimTextOnBg, paddingLeft: 4 }}>
                  CustomGPT.ai can make mistakes. Always check your answers.
                </span>
              )}
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
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30,
        background: `linear-gradient(to bottom, transparent, ${bgColor} 40%)`,
        paddingTop: 48,
      }}>
        <div style={{
          maxWidth: 756, margin: "0 auto",
          padding: "0 var(--spacing-lg) var(--spacing-md)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>

          {showSuggestions && (
            <div className={input.trim() ? "suggestions-dimmed" : undefined} style={{
              display: "flex", flexDirection: "column", gap: 8,
              padding: "12px 12px 8px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.14) 100%)",
              backdropFilter: "blur(28px) saturate(1.8)",
              WebkitBackdropFilter: "blur(28px) saturate(1.8)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderTopColor: "rgba(255,255,255,0.45)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 32px rgba(0,0,0,0.10)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
                <i className="ti ti-bulb" style={{ fontSize: 11, color: labelColor }} />
                <span className="shimmer-label" style={{ fontSize: "var(--text-xs)", color: labelColor, fontWeight: "var(--weight-medium)" }}>
                  Your agent can do even more
                </span>
                <button
                  onClick={() => {
                    setRailExiting(true);
                    setTimeout(() => { setRailDismissed(true); setRailExiting(false); }, 600);
                  }}
                  style={{
                    marginLeft: "auto",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(16px) saturate(1.6)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.6)",
                    padding: "2px 8px",
                    fontSize: "var(--text-xs)", color: dimTextOnBg,
                    cursor: "pointer", fontFamily: "inherit",
                    borderRadius: "var(--radius-sm)",
                    transition: "background var(--t-state), border-color var(--t-state), color var(--t-state)",
                  }}
                >
                  Not now
                </button>
              </div>
              <PostCreationRail key={railKey} bgColor={bgColor} isExiting={railExiting} />
            </div>
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
