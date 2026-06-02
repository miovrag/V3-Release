"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import PostCreationRail from "./PostCreationRail";
import SourcesCard from "./SourcesCard";
import {
  classifyStatic,
  type SuggestedActionsResult,
  type AgentState,
  type SuggestInput,
} from "@/lib/suggestedActions";
import { clarityEvent } from "@/lib/clarity";

const SplineBackground = dynamic(() => import("./SplineBackground"), { ssr: false });

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

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

const DISMISSED_KEY = "cg_dismissed_intents";
function getDismissed(): string[] {
  try { return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || "[]"); }
  catch { return []; }
}
function addDismissed(intent: string) {
  if (!intent || intent === "unknown") return;
  const current = getDismissed();
  if (!current.includes(intent)) {
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify([...current, intent]));
  }
}

const ALL_STARTER_QUESTIONS = [
  "How do I connect my tools?",
  "How do I set a persona?",
  "How do Smart Tasks work?",
  "How do I add a knowledge source?",
  "How do I publish my agent?",
  "How do I automate tasks?",
  "How do I share my agent?",
  "How do I add guardrails?",
];

const MOCK_ANSWER =
  "Connecting tools to your agent takes just a few steps:\n\n**1. Open the Actions tab** in your agent builder and click 'Add integration'\n\n**2. Pick from 100+ integrations** — Slack, Gmail, HubSpot, GitHub, Notion, and more\n\n**3. Set permissions** — decide exactly which actions your agent can take\n\nOnce connected, your agent can send Slack messages, create tasks, update CRM records — not just answer questions.";

const MOCK_ANSWER_PERSONA =
  "Setting up your agent's Persona shapes how it sounds and behaves in every reply:\n\n**1. Open Persona settings** in the Agent Builder\n\n**2. Give your agent a role** — define what it does and what it knows\n\n**3. Set the tone** — formal, casual, technical, or brand-friendly\n\n**4. Add guardrails** — topics to avoid, how to handle edge cases, response length\n\nOnce configured, every answer will reflect the personality and boundaries you've defined.";

const MOCK_ANSWER_SMART_TASKS =
  "Smart Tasks let your agent execute multi-step workflows automatically.\n\nWhen a user request triggers a Smart Task:\n\n**1. Planning** — the agent breaks the request into steps\n**2. Execution** — each step runs in sequence using connected tools\n**3. Error handling** — failed steps retry automatically or surface a clear message\n\nOpen Automations in the builder to define triggers, set conditions, and choose which tools the agent can use at each step.";

const MOCK_ANSWER_KNOWLEDGE =
  "Adding a knowledge source gives your agent trusted content to answer from:\n\n**1. Open the Sources tab** in your agent builder\n\n**2. Choose a source type** — upload a PDF, paste a URL, connect Google Drive, or add a sitemap\n\n**3. Let it process** — the agent indexes the content and starts citing it immediately\n\nOnce added, answers will reference your content directly and show citations so users can verify.";

const MOCK_ANSWER_PUBLISH =
  "Publishing makes your agent live and accessible to users:\n\n**1. Review your setup** — make sure Persona, sources, and any actions are configured\n\n**2. Open the Publish tab** and click 'Publish agent'\n\n**3. Copy the share link or embed code** — share it via email, embed it on your site, or add it to your app\n\nYou can re-publish any time after making changes. Users always get the latest version automatically.";

const MOCK_ANSWER_AUTOMATE =
  "Automations let your agent take action on a schedule or in response to events:\n\n**1. Open Automations** in the builder\n\n**2. Choose a trigger** — a schedule, an incoming webhook, or a user action\n\n**3. Define the steps** — the agent runs them in sequence using any connected tools\n\nOnce enabled, the automation runs without any user prompt — useful for recurring reports, alerts, or data syncs.";

const MOCK_ANSWER_GUARDRAILS =
  "Guardrails keep your agent focused and on-brand:\n\n**1. Open Persona settings** in the Agent Builder\n\n**2. Add a system instruction** — describe what topics to avoid, how to handle sensitive questions, and what tone to maintain\n\n**3. Set a fallback response** — what the agent says when a question is out of scope\n\nGuardrails are enforced on every reply, so your agent stays consistent even with unexpected questions.";

const SCENARIO_ANSWERS: Record<string, string> = {
  "How do I connect my tools?": MOCK_ANSWER,
  "How do I set a persona?": MOCK_ANSWER_PERSONA,
  "How do Smart Tasks work?": MOCK_ANSWER_SMART_TASKS,
  "How do I add a knowledge source?": MOCK_ANSWER_KNOWLEDGE,
  "How do I publish my agent?": MOCK_ANSWER_PUBLISH,
  "How do I automate tasks?": MOCK_ANSWER_AUTOMATE,
  "How do I share my agent?": MOCK_ANSWER_PUBLISH,
  "How do I add guardrails?": MOCK_ANSWER_GUARDRAILS,
};

const DEFAULT_AGENT_STATE: AgentState = {
  persona_configured: false,
  knowledge_sources_count: 0,
  actions_connected_count: 0,
  automations_count: 0,
  branding_configured: false,
  published: false,
  citations_tested: false,
};

const SCENARIO_STATES: Record<string, AgentState> = {
  "How do I connect my tools?":      { ...DEFAULT_AGENT_STATE },
  "How do I set a persona?":         { ...DEFAULT_AGENT_STATE },
  "How do Smart Tasks work?":        { ...DEFAULT_AGENT_STATE },
  "How do I add a knowledge source?":{ ...DEFAULT_AGENT_STATE },
  "How do I publish my agent?":      { ...DEFAULT_AGENT_STATE },
  "How do I automate tasks?":        { ...DEFAULT_AGENT_STATE },
  "How do I share my agent?":        { ...DEFAULT_AGENT_STATE },
  "How do I add guardrails?":        { ...DEFAULT_AGENT_STATE },
};

const MOCK_SOURCES: Source[] = [
  { name: "Integrations Setup Guide 2025.pdf", url: "#", domain: "app.customgpt.ai" },
  { name: "Actions & Permissions Overview.pdf", url: "#", domain: "app.customgpt.ai" },
  { name: "Agent Builder Documentation.pdf",   url: "#", domain: "app.customgpt.ai" },
];

const BUBBLE_STYLE = {
  display: "flex",
  width: "100%",
  padding: "16px",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "flex-start" as const,
  gap: 8,
  borderRadius: "var(--radius-md)",
  background: "#FFF",
};

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  if (c.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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
  videoUrl?: string | null;
  useApiMode?: boolean;
}

export default function ChatWindow({ bgColor = "#FAFAFA", showAvatar = true, videoUrl = null, useApiMode: useApiModeProp = false }: ChatWindowProps) {
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
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [starterQuestions, setStarterQuestions] = useState(() => pickRandom(ALL_STARTER_QUESTIONS, 3));
  const [suggestResult, setSuggestResult] = useState<SuggestedActionsResult | null>(null);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSentTextRef = useRef<string>("");
  const useApiModeRef = useRef(useApiModeProp);
  useEffect(() => { useApiModeRef.current = useApiModeProp; }, [useApiModeProp]);

  const handleCopy = (msg: Message) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(id => id === msg.id ? null : id), 1800);
  };

  const handleReaction = (id: string, vote: "up" | "down") => {
    setReactions(prev => ({ ...prev, [id]: prev[id] === vote ? null : vote }));
  };

  const lightBg = hexLuminance(bgColor) > 0.4;
  const bgL = hexLuminance(bgColor);

  // WCAG AA compliant color for disclaimer (≥4.5:1 against bgColor)
  const disclaimerColor = (() => {
    const darkContrast  = (bgL + 0.05) / 0.05;   // black on bg
    const lightContrast = 1.05 / (bgL + 0.05);    // white on bg
    if (darkContrast >= lightContrast) {
      // Light background: pick darkest gray that achieves 5:1 (buffer above 4.5)
      const targetL = Math.max(0, (bgL + 0.05) / 5.0 - 0.05);
      const s = targetL <= 0.0031308 ? targetL * 12.92 : 1.055 * Math.pow(targetL, 1 / 2.4) - 0.055;
      const v = Math.round(Math.min(255, s * 255));
      const h = v.toString(16).padStart(2, "0");
      return `#${h}${h}${h}`;
    }
    // Dark background: white is always the highest available contrast
    return "#ffffff";
  })();

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

  const containerVisible =
    (!railDismissed && phase === "responded" && streamingId === null && hasReachedBottom &&
      (isLoadingCards || suggestResult?.show === true)) ||
    railExiting;
  const showSuggestions = containerVisible; // alias used throughout JSX
  const cardCount = suggestResult?.show ? suggestResult.cards.length : 0;
  const bottomPanelHeight = containerVisible
    ? isLoadingCards ? 160 : 72 + 44 + cardCount * 68 + 16
    : 72;

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

  // Latch: once user has scrolled to bottom after answer streams, stay latched
  useEffect(() => {
    if (phase === "responded" && streamingId === null && bottomVisible) {
      setHasReachedBottom(true);
    }
  }, [phase, streamingId, bottomVisible]);

  useEffect(() => {
    if (!streamingId) return;
    const msg = messages.find(m => m.id === streamingId);
    if (!msg) return;
    if (streamedChars >= msg.text.length) {
      setStreamingId(null);

      // Compute contextual suggested actions after streaming completes
      const userText = lastSentTextRef.current;
      const agentState = SCENARIO_STATES[userText] ?? DEFAULT_AGENT_STATE;
      const suggestInput: SuggestInput = {
        locale: "en",
        conversation: {
          user_message: userText,
          assistant_answer: msg.text,
          recent_user_messages: [],
        },
        agent_state: agentState,
        current_section: "chat",
        session: { dismissed_categories: getDismissed() },
      };

      if (useApiModeRef.current) {
        setIsLoadingCards(true);
        fetch("/api/suggest", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(suggestInput),
        })
          .then(r => r.json())
          .then(result => {
            clarityEvent("sna_classified", { sna_intent: result.intent, sna_show: String(result.show) });
            if (result.show) clarityEvent("sna_shown", { sna_intent: result.intent, sna_cards: String(result.cards?.length ?? 0) });
            setSuggestResult(result);
            setIsLoadingCards(false);
          })
          .catch(() => {
            const fallback = classifyStatic(suggestInput);
            clarityEvent("sna_classified", { sna_intent: fallback.intent, sna_show: String(fallback.show) });
            if (fallback.show) clarityEvent("sna_shown", { sna_intent: fallback.intent, sna_cards: String(fallback.cards.length) });
            setSuggestResult(fallback);
            setIsLoadingCards(false);
          });
      } else {
        const staticResult = classifyStatic(suggestInput);
        clarityEvent("sna_classified", { sna_intent: staticResult.intent, sna_show: String(staticResult.show) });
        if (staticResult.show) clarityEvent("sna_shown", { sna_intent: staticResult.intent, sna_cards: String(staticResult.cards.length) });
        setSuggestResult(staticResult);
      }
      return;
    }
    const t = setTimeout(() => setStreamedChars(c => Math.min(c + 2, msg.text.length)), 12);
    return () => clearTimeout(t);
  }, [streamingId, streamedChars, messages]);

  const send = (text: string) => {
    if (phase === "typing" || !text.trim()) return;
    lastSentTextRef.current = text;
    if (showSuggestions) {
      clarityEvent("sna_ignored", { sna_intent: suggestResult?.intent ?? "unknown" });
      setRailExiting(true);
      setTimeout(() => {
        setRailDismissed(true);
        setRailExiting(false);
        setSuggestResult(null);
      }, 600);
    }
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setInput("");
    setPhase("typing");
    setTimeout(() => {
      const id = `a-${Date.now()}`;
      const answer = SCENARIO_ANSWERS[text] ?? MOCK_ANSWER;
      setMessages(prev => [...prev, { id, role: "agent", text: answer, sources: MOCK_SOURCES }]);
      setPhase("responded");
      setStreamingId(id);
      setStreamedChars(0);
      setDisclaimerSeen(true);
    }, 1000);
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
    setHasReachedBottom(false);
    setSuggestResult(null);
    setIsLoadingCards(false);
    lastSentTextRef.current = "";
    setStarterQuestions(pickRandom(ALL_STARTER_QUESTIONS, 3));
    try { sessionStorage.removeItem(DISMISSED_KEY); } catch { /* noop */ }
  };

  const avatarStyle = {
    width: 28, height: 28, flexShrink: 0 as const,
    borderRadius: "var(--radius-full)",
    background: avatarBg, color: textOnBg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "var(--text-xs)", fontWeight: "var(--weight-bold)" as const,
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>

      {/* Spline background layer */}
      {videoUrl && (
        <>
          <iframe
            src={videoUrl}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              border: "none", pointerEvents: "none",
              transform: "scale(1.6)",
              transformOrigin: "center center",
            }}
            allow="autoplay"
          />
          <div style={{
            position: "absolute", inset: 0,
            background: hexToRgba(bgColor, 0.55),
            pointerEvents: "none",
          }} />
        </>
      )}

    <div
      className={!videoUrl && lightBg ? "bg-animated" : undefined}
      style={{
        "--bg-end": bgColor,
        position: "relative",
        zIndex: 1,
        display: "flex", flexDirection: "column",
        height: "100vh",
        background: videoUrl ? "transparent" : (lightBg ? undefined : bgColor),
        overflow: "hidden",
      } as React.CSSProperties}
    >

      {/* ── Header ── */}
      <div style={{ flexShrink: 0 }}>
        <div className="chat-layout-header" style={{
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
        <div className="chat-layout-messages" style={{
          maxWidth: 756, margin: "0 auto",
          padding: `var(--spacing-md) var(--spacing-lg) ${bottomPanelHeight + 24}px`,
          display: "flex", flexDirection: "column", gap: "var(--spacing-md)",
          justifyContent: phase === "idle" ? "center" : "flex-start",
          alignItems: phase === "idle" ? "center" : "stretch",
          minHeight: "100%",
        }}>

          {messages.map((msg, msgIdx) =>
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
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {messages.slice(0, msgIdx).every(m => m.role === "user") && (
                  <span style={{ fontSize: "var(--text-xs)", color: disclaimerColor, display: "block", textAlign: "left", paddingLeft: showAvatar ? 52 : 16 }}>
                    CustomGPT.ai can make mistakes. Always check your answers.
                  </span>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
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
                      <div className="bubble-footer" style={{
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
                              padding: "4px 5px", borderRadius: "var(--radius-sm)",
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
                            padding: "4px 5px", borderRadius: "var(--radius-sm)",
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
                          Enterprise Agents
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.id !== streamingId && msg.sources && msg.sources.length > 0 && (
                    <SourcesCard sources={msg.sources} />
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
                padding: "12px 16px", borderRadius: "var(--radius-md)", background: "#FFF",
              }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {/* Starter question cards */}
          {phase === "idle" && messages.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
              {starterQuestions.map(q => (
                <button
                  key={q}
                  className="action-card"
                  onClick={() => send(q)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", padding: "16px",
                    borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.82)",
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
        background: videoUrl
          ? `linear-gradient(to bottom, transparent 0%, ${hexToRgba(bgColor, 0.55)} 55%)`
          : `linear-gradient(to bottom, transparent 0%, ${bgColor} 52%)`,
        paddingTop: 32,
      }}>
        <div className="chat-layout-panel" style={{
          maxWidth: 756, margin: "0 auto",
          padding: "0 var(--spacing-lg) var(--spacing-md)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>

          {showSuggestions && (
            <div className={[
              input.trim() ? "suggestions-dimmed" : "",
              railExiting ? "suggestions-exiting" : "",
            ].filter(Boolean).join(" ") || undefined} style={{
              display: "flex", flexDirection: "column", gap: 8,
              padding: "12px 12px 8px",
              borderRadius: "var(--radius-xl)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.14) 100%)",
              backdropFilter: "blur(28px) saturate(1.8)",
              WebkitBackdropFilter: "blur(28px) saturate(1.8)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderTopColor: "rgba(255,255,255,0.45)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 32px rgba(0,0,0,0.10)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
                <i className="ti ti-sparkles" style={{ fontSize: 11, color: labelColor }} />
                <span className={isLoadingCards ? "shimmer-label" : undefined} style={{ fontSize: "var(--text-xs)", color: labelColor, fontWeight: "var(--weight-medium)" }}>
                  {isLoadingCards ? "Analyzing…" : (suggestResult?.header ?? "Next step")}
                </span>
                {!isLoadingCards && (
                  <button
                    onClick={() => {
                      clarityEvent("sna_dismissed_notnow", { sna_intent: suggestResult?.intent ?? "unknown" });
                      addDismissed(suggestResult?.intent ?? "");
                      setRailExiting(true);
                      setTimeout(() => { setRailDismissed(true); setRailExiting(false); setSuggestResult(null); }, 600);
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
                )}
              </div>

              {isLoadingCards ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 4px" }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              ) : suggestResult?.show && (
                <PostCreationRail
                  key={railKey}
                  result={suggestResult}
                  isExiting={railExiting}
                  onDismissAll={() => {
                    addDismissed(suggestResult?.intent ?? "");
                    setRailExiting(true);
                    setTimeout(() => { setRailDismissed(true); setRailExiting(false); setSuggestResult(null); }, 600);
                  }}
                />
              )}
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
    </div>
  );
}
