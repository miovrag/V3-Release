"use client";

interface Props {
  onClose: () => void;
  onDone: () => void;
}

const STEPS = [
  { id: "adding", label: "Adding", detail: "500 documents", status: "active" },
  { id: "processing", label: "Document processing not started", detail: "", status: "pending" },
  { id: "personalization", label: "Agent personalization not started", detail: "", status: "pending" },
];

export default function BuildingModal({ onClose, onDone }: Props) {
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">Building your agent</h2>

        <div className="space-y-3 mb-6">
          {STEPS.map((step) => (
            <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              {step.status === "active" ? (
                <div className="w-8 h-8 rounded-full border-[3px] border-[#5B4FE8] border-t-transparent animate-spin flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-800">{step.label}</span>
              </div>
              {step.detail && (
                <span className="text-sm text-gray-400">{step.detail}</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">
          You will be able to chat with your agent as soon as we process a couple of documents. Feel free to leave this page or customize the agent—we&apos;ll notify you when it&apos;s ready.
        </p>

        <button
          onClick={onDone}
          className="w-full bg-[#5B4FE8] hover:bg-[#4A3ED6] text-white font-medium py-3 rounded-xl transition-colors opacity-60"
        >
          Try your new agent
        </button>
      </div>
    </div>
  );
}
