"use client";
import { useState } from "react";

const USE_CASES = [
  { id: "support", icon: "🎧", label: "Customer Support" },
  { id: "search", icon: "🔍", label: "Enterprise Search" },
  { id: "copilot", icon: "🌐", label: "Website Copilot" },
  { id: "product", icon: "📦", label: "Product Lookup" },
  { id: "leads", icon: "🔗", label: "Lead Generation" },
  { id: "revenue", icon: "📈", label: "Revenue Agent" },
];

interface Props {
  onNext: () => void;
  onClose: () => void;
}

export default function UseCaseModal({ onNext, onClose }: Props) {
  const [selected, setSelected] = useState("support");

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
          While your agent is getting ready, do one of these use cases best describe it?
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {USE_CASES.map((uc) => (
            <button
              key={uc.id}
              onClick={() => setSelected(uc.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selected === uc.id
                  ? "border-[#5B4FE8] bg-[#EEF0FF]"
                  : "border-gray-200 hover:border-[#C7C3F8] hover:bg-[#F8F7FF]"
              }`}
            >
              <span className="text-2xl">{uc.icon}</span>
              <span className="text-sm font-medium text-gray-800">{uc.label}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">
          Your agent will be able to resolve 93% of your customer support questions – instantly and accurately.
        </p>

        <button
          onClick={onNext}
          className="w-full bg-[#5B4FE8] hover:bg-[#4A3ED6] text-white font-medium py-3 rounded-xl transition-colors"
        >
          Continue
        </button>
        <button className="w-full mt-3 text-sm text-[#5B4FE8] hover:underline">
          No, I want my agent to do something else
        </button>
      </div>
    </div>
  );
}
