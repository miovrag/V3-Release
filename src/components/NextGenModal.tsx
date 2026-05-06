"use client";

interface Props {
  onEnable: () => void;
  onSkip: () => void;
  onClose: () => void;
}

function Illustration() {
  return (
    <svg
      width="100%"
      viewBox="0 0 520 172"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Diagram showing a question being broken into multiple steps by NextGen agent"
    >
      <rect width="520" height="172" rx="12" fill="#EAE8FD"/>

      {/* Input node */}
      <rect x="24" y="62" width="96" height="48" rx="8" fill="#FFFFFF" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="72" y="83" textAnchor="middle" fill="#737373" fontSize="10" fontFamily="Inter,system-ui" fontWeight="400">Your</text>
      <text x="72" y="97" textAnchor="middle" fill="#404040" fontSize="11" fontFamily="Inter,system-ui" fontWeight="600">question</text>

      {/* Connector line */}
      <line x1="120" y1="86" x2="160" y2="86" stroke="#A39BF6" strokeWidth="1.5" strokeDasharray="4 3"/>
      <polygon points="159,81 168,86 159,91" fill="#A39BF6"/>

      {/* Agent node */}
      <circle cx="208" cy="86" r="36" fill="rgba(115,103,240,0.10)"/>
      <circle cx="208" cy="86" r="26" fill="rgba(115,103,240,0.18)"/>
      <circle cx="208" cy="86" r="17" fill="#7367F0"/>
      {/* Lightning bolt */}
      <path d="M211 77L204 87H209L206 95L213 85H208L211 77Z" fill="#FFFFFF"/>

      {/* NextGen label */}
      <text x="208" y="134" textAnchor="middle" fill="#5C53C0" fontSize="9" fontFamily="Inter,system-ui" fontWeight="700" letterSpacing="0.08em">NEXTGEN</text>

      {/* Three output arrows */}
      <line x1="226" y1="74" x2="268" y2="50"  stroke="#A39BF6" strokeWidth="1.5"/>
      <polygon points="262,46 271,49 267,58" fill="#A39BF6"/>

      <line x1="228" y1="86" x2="272" y2="86"  stroke="#A39BF6" strokeWidth="1.5"/>
      <polygon points="271,81 280,86 271,91"    fill="#A39BF6"/>

      <line x1="226" y1="98" x2="268" y2="122" stroke="#A39BF6" strokeWidth="1.5"/>
      <polygon points="262,118 271,123 265,131" fill="#A39BF6"/>

      {/* Step boxes */}
      <rect x="280" y="28" width="92" height="36" rx="8" fill="#FFFFFF" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="326" y="43" textAnchor="middle" fill="#A3A3A3" fontSize="9"  fontFamily="Inter,system-ui">Step 1</text>
      <text x="326" y="56" textAnchor="middle" fill="#404040" fontSize="10" fontFamily="Inter,system-ui" fontWeight="600">Research</text>

      <rect x="280" y="68" width="92" height="36" rx="8" fill="#FFFFFF" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="326" y="83" textAnchor="middle" fill="#A3A3A3" fontSize="9"  fontFamily="Inter,system-ui">Step 2</text>
      <text x="326" y="96" textAnchor="middle" fill="#404040" fontSize="10" fontFamily="Inter,system-ui" fontWeight="600">Analyze</text>

      <rect x="280" y="108" width="92" height="36" rx="8" fill="#FFFFFF" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="326" y="123" textAnchor="middle" fill="#A3A3A3" fontSize="9"  fontFamily="Inter,system-ui">Step 3</text>
      <text x="326" y="136" textAnchor="middle" fill="#404040" fontSize="10" fontFamily="Inter,system-ui" fontWeight="600">Synthesize</text>

      {/* Final arrow */}
      <line x1="372" y1="86" x2="396" y2="86" stroke="#A39BF6" strokeWidth="1.5"/>
      <polygon points="395,81 404,86 395,91" fill="#A39BF6"/>

      {/* Answer node */}
      <rect x="404" y="58" width="92" height="56" rx="8" fill="#7367F0"/>
      <text x="450" y="80"  textAnchor="middle" fill="rgba(255,255,255,0.80)" fontSize="10" fontFamily="Inter,system-ui">Smart</text>
      <text x="450" y="94"  textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="Inter,system-ui" fontWeight="600">answer</text>
      <text x="450" y="107" textAnchor="middle" fill="rgba(255,255,255,0.60)" fontSize="9" fontFamily="Inter,system-ui">Done</text>
    </svg>
  );
}

const FEATURES = ["Multi-step reasoning", "Autonomous task planning", "Deeper answers"];

export default function NextGenModal({ onEnable, onSkip, onClose }: Props) {
  return (
    <div className="cg-overlay">
      <div className="cg-modal">
        {/* Top accent strip */}
        <div style={{
          height: 3,
          background: "var(--cg-grad-menu-active)",
          borderRadius: "16px 16px 0 0",
        }} />

        <button className="cg-modal-close" onClick={onClose} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{ padding: "28px 32px 32px" }}>
          {/* "New feature" chip */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <span className="chip new">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M7 1L3 7H6L5 11L9 5H6L7 1Z" fill="currentColor"/>
              </svg>
              New feature
            </span>
          </div>

          {/* Headline */}
          <h3 className="cg-h3" style={{ textAlign: "center", marginBottom: 4 }}>
            Meet NextGen
          </h3>
          <p style={{
            font: "400 14px/20px var(--cg-font-sans)",
            color: "var(--cg-primary)",
            textAlign: "center",
            fontWeight: 500,
            marginBottom: 20,
          }}>
            Your agent, supercharged
          </p>

          {/* Illustration */}
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
            <Illustration />
          </div>

          {/* Body copy */}
          <p style={{
            font: "400 14px/22px var(--cg-font-sans)",
            color: "var(--cg-fg-3)",
            textAlign: "center",
            marginBottom: 20,
          }}>
            NextGen enables your agent to break down complex questions, plan multi-step tasks, and deliver smarter answers — automatically.
          </p>

          {/* Feature chips */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
            {FEATURES.map((f) => (
              <span key={f} className="chip" style={{ fontSize: 12 }}>{f}</span>
            ))}
          </div>

          {/* Actions */}
          <button className="btn primary lg full" onClick={onEnable}>
            Enable NextGen
          </button>
          <button
            className="btn ghost md full"
            style={{ marginTop: 8 }}
            onClick={onSkip}
          >
            Continue without NextGen
          </button>
        </div>
      </div>
    </div>
  );
}
