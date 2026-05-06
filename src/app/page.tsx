"use client";

import { useState } from "react";
import WebsiteInputModal from "@/components/WebsiteInputModal";
import UseCaseModal from "@/components/UseCaseModal";
import NextGenModal from "@/components/NextGenModal";
import BuildingModal from "@/components/BuildingModal";
import AgentsList from "@/components/AgentsList";
import AgentDetailHeader from "@/components/AgentDetailHeader";

type FlowStep = "website" | "usecase" | "nextgen" | "building" | null;

const FLOW_STEPS = [
  { id: "website", label: "1. Enter URL",  note: "Existing" },
  { id: "usecase", label: "2. Use case",   note: "Existing" },
  { id: "nextgen", label: "3. NextGen",    note: "New" },
  { id: "building",label: "4. Building",  note: "Existing" },
] as const;

export default function Home() {
  const [step, setStep] = useState<FlowStep>(null);
  const [result, setResult] = useState<"enabled" | "skipped" | null>(null);

  const close = () => setStep(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cg-bg-body)" }}>

      {/* Header */}
      <header style={{
        background: "var(--cg-bg-card)",
        borderBottom: "1px solid var(--cg-gray-200)",
        padding: "0 32px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--cg-grad-menu-active)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L4 8H7.5L6 14.5L12 8H8.5L8 1.5Z" fill="#fff"/>
            </svg>
          </div>
          <span style={{ font: "700 15px/1 var(--cg-font-sans)", color: "var(--cg-fg-1)" }}>
            CustomGPT.ai
          </span>
        </div>
        <span className="b filled-primary">V3 Release</span>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px", display: "flex", flexDirection: "column", gap: 48 }}>

        {/* ── Section: Creation flow ── */}
        <section>
          <h2 style={{ font: "700 20px/28px var(--cg-font-sans)", color: "var(--cg-fg-1)", marginBottom: 4 }}>
            Agent creation flow
          </h2>
          <p style={{ font: "400 14px/20px var(--cg-font-sans)", color: "var(--cg-fg-3)", marginBottom: 20 }}>
            NextGen modal slots in between use case selection and the building screen — impossible to skip, zero added friction.
          </p>

          {/* Flow step cards */}
          <div className="card" style={{ marginBottom: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {FLOW_STEPS.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => setStep(s.id as FlowStep)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: "12px 16px", borderRadius: 12, minWidth: 110,
                      border: `2px solid ${s.id === "nextgen" ? "var(--cg-primary)" : "var(--cg-gray-200)"}`,
                      background: s.id === "nextgen" ? "var(--cg-primary-100)" : "var(--cg-bg-card)",
                      transition: "all var(--cg-dur-fast)",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (s.id !== "nextgen") e.currentTarget.style.borderColor = "var(--cg-primary-300)";
                    }}
                    onMouseLeave={(e) => {
                      if (s.id !== "nextgen") e.currentTarget.style.borderColor = "var(--cg-gray-200)";
                    }}
                  >
                    <span style={{
                      font: "600 13px/18px var(--cg-font-sans)",
                      color: s.id === "nextgen" ? "var(--cg-primary-active)" : "var(--cg-fg-2)",
                    }}>
                      {s.label}
                    </span>
                    <span style={{
                      font: "600 10px/14px var(--cg-font-sans)",
                      letterSpacing: ".04em",
                      padding: "1px 8px", borderRadius: 999,
                      background: s.id === "nextgen" ? "var(--cg-primary)" : "var(--cg-gray-100)",
                      color: s.id === "nextgen" ? "#fff" : "var(--cg-fg-3)",
                    }}>
                      {s.note}
                    </span>
                  </button>

                  {i < FLOW_STEPS.length - 1 && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M5 10H15M15 10L11 6M15 10L11 14" stroke="var(--cg-gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p style={{ font: "400 12px/16px var(--cg-font-sans)", color: "var(--cg-fg-4)", marginTop: 12 }}>
              Click any step to preview, or run the full flow below
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="btn primary md"
              onClick={() => { setResult(null); setStep("website"); }}
            >
              Start full flow demo
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {result && (
              <span style={{ font: "400 14px/20px var(--cg-font-sans)", color: "var(--cg-fg-3)" }}>
                {result === "enabled" ? "NextGen enabled — agent is building" : "Continued without NextGen"}
              </span>
            )}
          </div>
        </section>

        {/* ── Section: Agent detail header ── */}
        <section>
          <h2 style={{ font: "700 20px/28px var(--cg-font-sans)", color: "var(--cg-fg-1)", marginBottom: 4 }}>
            Agent detail — H1 row
          </h2>
          <p style={{ font: "400 14px/20px var(--cg-font-sans)", color: "var(--cg-fg-3)", marginBottom: 16 }}>
            NextGen badge sits inline with the agent name. Click it to navigate to the Intelligence tab.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--cg-gray-200)" }}>
              <AgentDetailHeader
                agentName="Support Agent"
                isNextGen={true}
                onNextGenClick={() => alert("Navigates to Intelligence tab")}
              />
            </div>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--cg-gray-200)" }}>
              <AgentDetailHeader agentName="Docs Search" isNextGen={false} />
            </div>
          </div>
        </section>

        {/* ── Section: Agents list ── */}
        <section>
          <h2 style={{ font: "700 20px/28px var(--cg-font-sans)", color: "var(--cg-fg-1)", marginBottom: 4 }}>
            Agents list
          </h2>
          <p style={{ font: "400 14px/20px var(--cg-font-sans)", color: "var(--cg-fg-3)", marginBottom: 16 }}>
            NextGen badge appears per row alongside the Multi-Agent tag.
          </p>
          <AgentsList />
        </section>

      </main>

      {/* Modals */}
      {step === "website"  && <WebsiteInputModal  onNext={() => setStep("usecase")}  onClose={close} />}
      {step === "usecase"  && <UseCaseModal        onNext={() => setStep("nextgen")}  onClose={close} />}
      {step === "nextgen"  && <NextGenModal
        onEnable={() => { setResult("enabled"); setStep("building"); }}
        onSkip={()   => { setResult("skipped"); setStep("building"); }}
        onClose={close}
      />}
      {step === "building" && <BuildingModal onClose={close} onDone={close} />}
    </div>
  );
}
