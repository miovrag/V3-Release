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
  { id: "website", label: "1. Enter URL", sub: "Existing" },
  { id: "usecase", label: "2. Use Case", sub: "Existing" },
  { id: "nextgen", label: "3. NextGen", sub: "New ✦" },
  { id: "building", label: "4. Building", sub: "Existing" },
] as const;

export default function Home() {
  const [step, setStep] = useState<FlowStep>(null);
  const [completedStep, setCompletedStep] = useState<string | null>(null);

  const close = () => setStep(null);

  const handleEnable = () => {
    setCompletedStep("nextgen-enabled");
    setStep("building");
  };
  const handleSkip = () => {
    setCompletedStep("nextgen-skipped");
    setStep("building");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B4FE8] to-[#8B7FFF] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L4 8H7.5L6 14L12 8H8.5L8 2Z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg">CustomGPT.ai</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#5B4FE8] to-[#8B7FFF] text-white text-xs font-semibold">
            V3 Release UI
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* ── SECTION 1: Creation Flow ── */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Agent Creation Flow</h2>
            <p className="text-sm text-gray-500 mt-1">
              NextGen modal is injected between Use Case selection and Building — impossible to miss, zero added friction.
            </p>
          </div>

          {/* Flow diagram */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {FLOW_STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setStep(s.id as FlowStep)}
                    className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-all min-w-[110px] ${
                      s.id === "nextgen"
                        ? "border-[#5B4FE8] bg-[#EEF0FF] hover:bg-[#E4E1FF]"
                        : "border-gray-200 hover:border-[#C7C3F8] hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-xs font-semibold ${s.id === "nextgen" ? "text-[#5B4FE8]" : "text-gray-700"}`}>
                      {s.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      s.id === "nextgen"
                        ? "bg-[#5B4FE8] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      {s.sub}
                    </span>
                  </button>
                  {i < FLOW_STEPS.length - 1 && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-300 flex-shrink-0">
                      <path d="M6 10H14M14 10L10 6M14 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">Click any step to preview that modal, or start the full flow below</p>
          </div>

          {/* Start flow CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCompletedStep(null); setStep("website"); }}
              className="px-6 py-3 bg-[#5B4FE8] hover:bg-[#4A3ED6] text-white font-medium rounded-xl transition-colors text-sm"
            >
              Start Full Flow Demo →
            </button>
            {completedStep && (
              <span className="text-sm text-gray-500">
                {completedStep === "nextgen-enabled"
                  ? "✓ NextGen enabled — agent is building"
                  : "→ Continued without NextGen"}
              </span>
            )}
          </div>
        </section>

        {/* ── SECTION 2: Agent Detail Header ── */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Agent Detail — H1 Row</h2>
            <p className="text-sm text-gray-500 mt-1">
              NextGen badge sits inline with the agent name. Click it to jump to the Intelligence tab.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <AgentDetailHeader
              agentName="Support Agent"
              isNextGen={true}
              onNextGenClick={() => alert("→ Navigates to Intelligence tab")}
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white mt-3">
            <AgentDetailHeader
              agentName="Docs Search"
              isNextGen={false}
            />
          </div>
        </section>

        {/* ── SECTION 3: Agents List ── */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Agents List</h2>
            <p className="text-sm text-gray-500 mt-1">
              NextGen tag appears alongside Multi-Agent on each agent row.
            </p>
          </div>
          <AgentsList />
        </section>

      </main>

      {/* Modals */}
      {step === "website" && (
        <WebsiteInputModal onNext={() => setStep("usecase")} onClose={close} />
      )}
      {step === "usecase" && (
        <UseCaseModal onNext={() => setStep("nextgen")} onClose={close} />
      )}
      {step === "nextgen" && (
        <NextGenModal onEnable={handleEnable} onSkip={handleSkip} onClose={close} />
      )}
      {step === "building" && (
        <BuildingModal onClose={close} onDone={close} />
      )}
    </div>
  );
}
