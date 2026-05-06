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
  { id: "website",  label: "1. Enter URL",  note: "Existing" },
  { id: "usecase",  label: "2. Use case",   note: "Existing" },
  { id: "nextgen",  label: "3. NextGen",    note: "New" },
  { id: "building", label: "4. Building",   note: "Existing" },
] as const;

export default function Home() {
  const [step, setStep]     = useState<FlowStep>(null);
  const [result, setResult] = useState<"enabled" | "skipped" | null>(null);

  const close = () => setStep(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)" }}>

      {/* Top bar */}
      <header style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
        padding: "0 var(--spacing-xl)",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <i className="ti ti-robot" style={{ fontSize: 24, color: "var(--brand-primary-default)" }} />
          <span style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)" }}>
            CustomGPT.ai
          </span>
        </div>
        <span className="badge badge-primary">V3 Release</span>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "var(--spacing-3xl) var(--spacing-xl)", display: "flex", flexDirection: "column", gap: "var(--spacing-3xl)" }}>

        {/* ── Creation flow ── */}
        <section>
          <p className="section-label" style={{ marginBottom: "var(--spacing-sm)" }}>Agent creation flow</p>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)", marginBottom: "var(--spacing-xs)" }}>
            NextGen prompt in the creation flow
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--spacing-xl)" }}>
            Modal is injected between use case selection and the building screen — impossible to skip, zero added friction.
          </p>

          {/* Flow stepper */}
          <div className="card" style={{ marginBottom: "var(--spacing-lg)", padding: "var(--spacing-lg)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", overflowX: "auto" }}>
              {FLOW_STEPS.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", flexShrink: 0 }}>
                  <button
                    onClick={() => setStep(s.id as FlowStep)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "flex-start",
                      gap: "var(--spacing-xs)",
                      padding: "var(--spacing-md) var(--spacing-lg)",
                      borderRadius: "var(--radius-md)",
                      minWidth: 120,
                      border: `2px solid ${s.id === "nextgen" ? "var(--brand-primary-default)" : "var(--border-default)"}`,
                      background: s.id === "nextgen" ? "var(--brand-primary-tint)" : "var(--bg-surface)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all var(--t-state)",
                    }}
                  >
                    <span style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--weight-semibold)",
                      color: s.id === "nextgen" ? "var(--brand-primary-active)" : "var(--text-body)",
                    }}>
                      {s.label}
                    </span>
                    <span className={`badge ${s.id === "nextgen" ? "badge-primary" : "badge-default"}`}>
                      {s.note}
                    </span>
                  </button>

                  {i < FLOW_STEPS.length - 1 && (
                    <i className="ti ti-arrow-right" style={{ color: "var(--border-emphasis)", fontSize: 16, flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: "var(--spacing-md)" }}>
              Click any step to preview that modal individually
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-lg)" }}>
            <button
              className="btn btn-primary"
              onClick={() => { setResult(null); setStep("website"); }}
            >
              <i className="ti ti-player-play" />
              Start full flow
            </button>
            {result && (
              <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                {result === "enabled" ? "NextGen enabled — agent is building" : "Continued without NextGen"}
              </span>
            )}
          </div>
        </section>

        {/* ── Agent detail header ── */}
        <section>
          <p className="section-label" style={{ marginBottom: "var(--spacing-sm)" }}>Agent detail — H1 row</p>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)", marginBottom: "var(--spacing-xs)" }}>
            NextGen badge in agent header
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--spacing-lg)" }}>
            Badge sits inline with the agent name. Click it to go to the Intelligence tab.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
            <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border-default)" }}>
              <AgentDetailHeader
                agentName="Support Agent"
                isNextGen={true}
                onNextGenClick={() => alert("→ Navigates to Intelligence tab")}
              />
            </div>
            <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1px solid var(--border-default)" }}>
              <AgentDetailHeader agentName="Docs Search" isNextGen={false} />
            </div>
          </div>
        </section>

        {/* ── Agents list ── */}
        <section>
          <p className="section-label" style={{ marginBottom: "var(--spacing-sm)" }}>Agents list</p>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)", marginBottom: "var(--spacing-xs)" }}>
            NextGen tag per agent row
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--spacing-lg)" }}>
            NextGen badge appears alongside the Multi-Agent tag on each row.
          </p>
          <AgentsList />
        </section>

      </main>

      {step === "website"  && <WebsiteInputModal onNext={() => setStep("usecase")} onClose={close} />}
      {step === "usecase"  && <UseCaseModal      onNext={() => setStep("nextgen")} onClose={close} />}
      {step === "nextgen"  && <NextGenModal
        onEnable={() => { setResult("enabled"); setStep("building"); }}
        onSkip={()   => { setResult("skipped"); setStep("building"); }}
        onClose={close}
      />}
      {step === "building" && <BuildingModal onClose={close} onDone={close} />}
    </div>
  );
}
