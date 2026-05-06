"use client";
import NextGenBadge from "./NextGenBadge";

interface Props {
  agentName: string;
  isNextGen: boolean;
  onNextGenClick?: () => void;
}

export default function AgentDetailHeader({ agentName, isNextGen, onNextGenClick }: Props) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5">
      <div className="flex items-center gap-3">
        {/* Agent avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B4FE8] to-[#8B7FFF] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {agentName.charAt(0).toUpperCase()}
        </div>

        {/* Name + badges */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">{agentName}</h1>
          {isNextGen && (
            <NextGenBadge
              onClick={onNextGenClick}
              size="md"
            />
          )}
          {!isNextGen && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              Standard
            </span>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            Settings
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-[#5B4FE8] hover:bg-[#4A3ED6] text-white rounded-lg transition-colors">
            Open Chat
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-6 mt-4 border-t border-gray-100 pt-3">
        {["Overview", "Sources", "Customize", "Intelligence", "Deploy", "Analytics"].map((tab) => (
          <button
            key={tab}
            className={`text-sm pb-2 border-b-2 transition-colors ${
              tab === "Intelligence"
                ? "border-[#5B4FE8] text-[#5B4FE8] font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
