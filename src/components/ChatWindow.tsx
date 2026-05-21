"use client";

import { useState, useEffect, useRef } from "react";
import PostCreationRail from "./PostCreationRail";
import ToolCallCard from "./ToolCallCard";

type Phase = "idle" | "typing" | "tool_call" | "responded";

interface Message {
  id: string;
  role: "agent" | "user" | "tool_call";
  text: string;
  action?: string;
  toolStatus?: "pending" | "approved" | "denied";
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

const MOCK_TOOL_ACTION = 'query_crm(tickets, range="Q3", limit=500)';

const AVATAR_STYLE = {
  width: 28, height: 28, flexShrink: 0 as const,
  borderRadius: "var(--radius-full)",
  background: "rgba(255,255,255,0.25)", color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)" as const,
};

const BUBBLE_STYLE = {
  display: "flex",
  width: 574,
  padding: "8px 16px",
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
      const toolId = `tc-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        { id: toolId, role: "tool_call", text: "", action: MOCK_TOOL_ACTION, toolStatus: "pending" },
      ]);
      setPhase("tool_call");
    }, 1500);
  };

  const approve = (toolId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === toolId ? { ...m, toolStatus: "approved" as const } : m)
    );
    setPhase("typing");
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, role: "agent", text: MOCK_ANSWER, showRail: true },
      ]);
      setPhase("responded");
    }, 1200);
  };

  const deny = (toolId: string) => {
    setMessages(prev =>
      prev.map(m => m.id === toolId ? { ...m, toolStatus: "denied" as const } : m)
    );
    setPhase("idle");
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
          ) : msg.role === "tool_call" ? (
            <div key={msg.id}>
              <ToolCallCard
                action={msg.action!}
                status={msg.toolStatus!}
                onAllow={() => approve(msg.id)}
                onDeny={() => deny(msg.id)}
              />
            </div>
          ) : (
            <div key={msg.id} style={{ display: "flex", gap: "var(--spacing-sm)", alignItems: "flex-start" }}>
              <div style={AVATAR_STYLE}>{AGENT_INITIAL}</div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", minWidth: 0 }}>
                <div style={BUBBLE_STYLE}>
                  <div style={{
                    fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
                    color: "var(--text-body)", whiteSpace: "pre-line", width: "100%",
                  }}>
                    {msg.text}
                  </div>
                  {msg.id !== "welcome" && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      borderTop: "1px solid var(--border-default)",
                      paddingTop: "var(--spacing-sm)",
                      width: "100%",
                      fontSize: "var(--text-xs)", color: "var(--text-muted)",
                    }}>
                      <i className="ti ti-bolt" style={{ fontSize: 12, color: "var(--brand-primary-default)" }} />
                      Powered by Enterprise Agents
                    </div>
                  )}
                </div>

                {msg.showRail && (
                  <>
                    <div ref={msgEndRef} />
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)", paddingTop: "var(--spacing-xs)" }}>
                      <i className="ti ti-sparkles" style={{ fontSize: 11, color: labelColor }} />
                      <span style={{ fontSize: "var(--text-xs)", color: labelColor, fontWeight: "var(--weight-medium)" }}>
                        Your agent can do even more
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
              display: "flex", alignItems: "center", gap: "var(--spacing-xs)",
              padding: "12px 16px", borderRadius: 8, background: "#FFF",
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
          disabled={phase === "typing" || phase === "tool_call"}
        />
        <button
          onClick={() => send(input)}
          disabled={phase !== "idle" || !input.trim()}
          style={{
            width: 36, height: 36, flexShrink: 0,
            borderRadius: "var(--radius-full)",
            background: input.trim() && phase === "idle" ? "#fff" : "rgba(255,255,255,0.2)",
            border: "none",
            cursor: input.trim() && phase === "idle" ? "pointer" : "default",
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
