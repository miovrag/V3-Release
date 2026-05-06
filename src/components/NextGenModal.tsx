"use client";

interface Props {
  onEnable: () => void;
  onSkip: () => void;
  onClose: () => void;
}

function NextGenIllustration() {
  return (
    <svg width="100%" viewBox="0 0 480 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="480" height="160" rx="16" fill="#EEF0FF" />

      {/* Input node */}
      <rect x="20" y="56" width="100" height="48" rx="10" fill="white" stroke="#C7C3F8" strokeWidth="1.5" />
      <text x="70" y="77" textAnchor="middle" fill="#5B4FE8" fontSize="10" fontWeight="600" fontFamily="system-ui">Your</text>
      <text x="70" y="92" textAnchor="middle" fill="#5B4FE8" fontSize="10" fontWeight="600" fontFamily="system-ui">Question</text>

      {/* Arrow from input to brain */}
      <line x1="120" y1="80" x2="166" y2="80" stroke="#A89EF5" strokeWidth="1.5" strokeDasharray="4 3" />
      <polygon points="166,75 174,80 166,85" fill="#A89EF5" />

      {/* Brain / agent node */}
      <circle cx="210" cy="80" r="34" fill="#5B4FE8" opacity="0.12" />
      <circle cx="210" cy="80" r="24" fill="#5B4FE8" opacity="0.2" />
      <circle cx="210" cy="80" r="15" fill="#5B4FE8" />
      {/* Lightning bolt icon */}
      <path d="M213 71L206 81H211L208 89L215 79H210L213 71Z" fill="white" />

      {/* Label under brain */}
      <text x="210" y="125" textAnchor="middle" fill="#5B4FE8" fontSize="9" fontWeight="700" fontFamily="system-ui" letterSpacing="0.5">NEXTGEN</text>

      {/* Three output arrows */}
      <line x1="225" y1="68" x2="268" y2="44" stroke="#A89EF5" strokeWidth="1.5" />
      <polygon points="262,40 270,43 266,51" fill="#A89EF5" />

      <line x1="228" y1="80" x2="272" y2="80" stroke="#A89EF5" strokeWidth="1.5" />
      <polygon points="271,75 279,80 271,85" fill="#A89EF5" />

      <line x1="225" y1="92" x2="268" y2="116" stroke="#A89EF5" strokeWidth="1.5" />
      <polygon points="262,112 270,117 264,124" fill="#A89EF5" />

      {/* Output task boxes */}
      <rect x="278" y="22" width="86" height="36" rx="8" fill="white" stroke="#C7C3F8" strokeWidth="1.5" />
      <text x="321" y="36" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="system-ui">Step 1</text>
      <text x="321" y="49" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600" fontFamily="system-ui">Research</text>

      <rect x="278" y="62" width="86" height="36" rx="8" fill="white" stroke="#C7C3F8" strokeWidth="1.5" />
      <text x="321" y="76" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="system-ui">Step 2</text>
      <text x="321" y="89" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600" fontFamily="system-ui">Analyze</text>

      <rect x="278" y="102" width="86" height="36" rx="8" fill="white" stroke="#C7C3F8" strokeWidth="1.5" />
      <text x="321" y="116" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="system-ui">Step 3</text>
      <text x="321" y="129" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="600" fontFamily="system-ui">Synthesize</text>

      {/* Final answer arrow + box */}
      <line x1="364" y1="80" x2="386" y2="80" stroke="#A89EF5" strokeWidth="1.5" />
      <polygon points="385,75 393,80 385,85" fill="#A89EF5" />

      <rect x="392" y="56" width="72" height="48" rx="10" fill="#5B4FE8" />
      <text x="428" y="76" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui">Smart</text>
      <text x="428" y="89" textAnchor="middle" fill="white" fontSize="9" fontFamily="system-ui">Answer</text>
      <text x="428" y="102" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="system-ui">✓ Done</text>
    </svg>
  );
}

export default function NextGenModal({ onEnable, onSkip, onClose }: Props) {
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative">
        {/* Header accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#5B4FE8] via-[#8B7FFF] to-[#5B4FE8]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="px-8 pt-6 pb-2">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF0FF] text-[#5B4FE8] text-xs font-semibold tracking-wide uppercase">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7 1L3 7H6L5 11L9 5H6L7 1Z" fill="#5B4FE8"/>
              </svg>
              New Feature
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
            Meet NextGen
          </h2>
          <p className="text-center text-[#5B4FE8] font-semibold text-base mb-4">
            Your agent, supercharged
          </p>

          {/* Illustration */}
          <div className="rounded-xl overflow-hidden mb-5">
            <NextGenIllustration />
          </div>

          {/* Body copy */}
          <p className="text-center text-gray-500 text-sm leading-relaxed mb-5">
            NextGen enables your agent to break down complex questions, plan multi-step tasks, and deliver smarter answers — automatically.
          </p>

          {/* Feature pills */}
          <div className="flex gap-2 justify-center flex-wrap mb-6">
            {["Multi-step reasoning", "Autonomous task planning", "Deeper answers"].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full border border-[#C7C3F8] bg-[#F8F7FF] text-[#5B4FE8] text-xs font-medium"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={onEnable}
            className="w-full bg-[#5B4FE8] hover:bg-[#4A3ED6] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Enable NextGen
          </button>
          <button
            onClick={onSkip}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            Continue without NextGen
          </button>
        </div>
      </div>
    </div>
  );
}
