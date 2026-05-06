"use client";
import NextGenBadge from "./NextGenBadge";

const AGENTS = [
  {
    id: 1,
    name: "Support Agent",
    description: "Customer support for our product",
    queries: 1842,
    isNextGen: true,
    isMultiAgent: false,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    name: "Sales Copilot",
    description: "Lead qualification and revenue flows",
    queries: 934,
    isNextGen: true,
    isMultiAgent: false,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Docs Search",
    description: "Enterprise documentation search",
    queries: 3201,
    isNextGen: false,
    isMultiAgent: false,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    name: "Research Hub",
    description: "Deep research across all sources",
    queries: 567,
    isNextGen: true,
    isMultiAgent: true,
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 5,
    name: "HR Assistant",
    description: "Internal HR policies and onboarding",
    queries: 289,
    isNextGen: false,
    isMultiAgent: false,
    color: "from-pink-500 to-rose-500",
  },
];

export default function AgentsList() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-gray-900">Agents</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{AGENTS.length}</span>
        </div>
        <button className="px-4 py-2 bg-[#5B4FE8] hover:bg-[#4A3ED6] text-white text-sm font-medium rounded-lg transition-colors">
          + New Agent
        </button>
      </div>

      {/* Agent rows */}
      <div className="divide-y divide-gray-50">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
            >
              {agent.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{agent.name}</span>
                {agent.isNextGen && <NextGenBadge size="sm" />}
                {agent.isMultiAgent && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-600">
                    Multi-Agent
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{agent.description}</p>
            </div>

            {/* Queries */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-gray-700">{agent.queries.toLocaleString()}</p>
              <p className="text-xs text-gray-400">queries</p>
            </div>

            {/* Arrow */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300 flex-shrink-0">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
