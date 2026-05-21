"use client";

import { useState, useEffect, useRef } from "react";
import PostCreationRail from "./PostCreationRail";

type Phase = "idle" | "typing" | "responded";

interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
  showRail?: boolean;
}

const AGENT_INITIAL = "S";
const AGENT_NAME = "Support Agent";

const STARTER_QUESTIONS = [
  "What are our top 3 cancellation reasons?",
  "Summarise last quarter's support tickets",
  "Which features are users requesting most?",
];

const WELCOME =
  "Hi! I've processed your knowledge base and I'm ready to help. Try one of the questions below or ask your own.";

const MOCK_ANSWER =
  "I analysed your support tickets and CRM data across 3 reasoning steps:\n\n**Top 3 cancellation reasons:**\n1. Pricing — 34% (↑8pp vs Q4, driven by January repricing)\n2. Missing features — 28% (stable; top gaps: bulk export, SSO)\n3. Competitor switch — 21% (↓4pp, mostly to Intercom)\n\n**Key shift:** Pricing complaints nearly doubled after the January repricing. Feature gap complaints stayed flat, suggesting the roadmap is holding retention there.";

const AVATAR_STYLE = {
  width: 28, height: 28, flexShrink: 0 as const,
  borderRadius: "var(--radius-full)",
  background: "rgba(255,255,255,0.25)", color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)" as const,
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
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "agent", text: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [railKey, setRailKey] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const lightBg = hexLuminance(bgColor) > 0.4;
  const labelColor = lightBg ? "var(--text-muted)" : "rgba(255,255,255,0.45)";

  useEffect(() => {
    const target = msgEndRef.current ?? bottomRef.current;
    target?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase]);

  const send = (text: string) => {
    if (phase !== "idle" || !text.trim()) return;
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setInput("");
    setPhase("typing");
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, role: "agent", text: MOCK_ANSWER, showRail: true },
      ]);
      setPhase("responded");
    }, 1500);
  };

  const reset = () => {
    setPhase("idle");
    setMessages([{ id: "welcome", role: "agent", text: WELCOME }]);
    setRailKey(k => k + 1);
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 104px)",
      background: bgColor,
      borderRadius: "var(--radius-xl)",
      overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--spacing-md) var(--spacing-lg)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <div style={{ ...AVATAR_STYLE, width: 32, height: 32, fontSize: "var(--text-sm)" }}>
            {AGENT_INITIAL}
          </div>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "#fff" }}>
            {AGENT_NAME}
          </span>
        </div>
        {phase === "responded" && (
          <button
            onClick={reset}
            style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "var(--radius-md)", padding: "var(--spacing-xs) var(--spacing-sm)",
              color: "#fff", fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: "var(--spacing-xs)",
              transition: "background var(--t-state)",
            }}
          >
            <i className="ti ti-refresh" style={{ fontSize: 12 }} />
            Reset
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "var(--spacing-md) var(--spacing-lg)",
        display: "flex", flexDirection: "column", gap: "var(--spacing-md)",
      }}>

        {messages.map(msg =>
          msg.role === "user" ? (
            /* User bubble — frosted right */
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                maxWidth: "75%",
                padding: "var(--spacing-sm) var(--spacing-md)",
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)",
                fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
              }}>
                {msg.text}
              </div>
            </div>
          ) : (
            /* Agent bubble — white left */
            <div key={msg.id} style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "flex-start" }}>
              <div style={AVATAR_STYLE}>{AGENT_INITIAL}</div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", minWidth: 0 }}>
                <div style={{
                  background: "#fff",
                  borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
                  overflow: "hidden",
                  alignSelf: "flex-start",
                  maxWidth: "85%",
                }}>
                  <div style={{
                    padding: "var(--spacing-md)",
                    fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
                    color: "var(--text-body)", whiteSpace: "pre-line",
                  }}>
                    {msg.text}
                  </div>
                  {msg.id !== "welcome" && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      borderTop: "1px solid var(--border-default)",
                      background: "var(--bg-canvas)",
                      fontSize: "var(--text-xs)", color: "var(--text-muted)",
                    }}>
                      <i className="ti ti-bolt" style={{ fontSize: 12, color: "var(--brand-primary-default)" }} />
                      Powered by Enterprise Agents
                    </div>
                  )}
                </div>

                {msg.showRail && (
                  <>
                    {/* Scroll stops here — rail stays below the fold until user scrolls */}
                    <div ref={msgEndRef} />
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", paddingTop: "var(--spacing-xs)" }}>
                      <i className="ti ti-bulb" style={{ fontSize: 11, color: labelColor }} />
                      <span style={{ fontSize: "var(--text-xs)", color: labelColor, fontWeight: "var(--weight-medium)" }}>
                        What to set up next
                      </span>
                    </div>
                    <div style={{ maxWidth: "85%" }}>
                      <PostCreationRail key={railKey} bgColor={bgColor} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        )}

        {/* Typing indicator */}
        {phase === "typing" && (
          <div style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "flex-start" }}>
            <div style={AVATAR_STYLE}>{AGENT_INITIAL}</div>
            <div style={{
              background: "#fff",
              borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)",
              padding: "var(--spacing-md)",
              display: "flex", alignItems: "center", gap: "var(--spacing-xs)",
            }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Starter question bubbles */}
        {phase === "idle" && messages.length === 1 && (
          <div style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "flex-start" }}>
            <div style={AVATAR_STYLE}>{AGENT_INITIAL}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
              {STARTER_QUESTIONS.map(q => (
                <button
                  key={q}
                  className="starter-q"
                  onClick={() => send(q)}
                  style={{ borderRadius: "var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Composer ── */}
      <div style={{
        display: "flex", gap: "var(--spacing-sm)", alignItems: "center",
        padding: "var(--spacing-md) var(--spacing-lg)",
        flexShrink: 0,
      }}>
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") send(input); }}
          placeholder="Ask anything…"
          disabled={phase === "typing"}
        />
        <button
          onClick={() => send(input)}
          disabled={phase === "typing" || !input.trim()}
          style={{
            width: 36, height: 36, flexShrink: 0,
            borderRadius: "var(--radius-full)",
            background: input.trim() && phase !== "typing" ? "#fff" : "rgba(255,255,255,0.2)",
            border: "none",
            cursor: input.trim() && phase !== "typing" ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background var(--t-state)",
            color: "var(--brand-primary-default)",
          }}
        >
          <i className="ti ti-send" style={{ fontSize: 16 }} />
        </button>
      </div>

    </div>
  );
}
