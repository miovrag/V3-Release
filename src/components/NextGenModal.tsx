"use client";

interface Props {
  onEnable: () => void;
  onSkip: () => void;
  onClose: () => void;
}

function ModalIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 560 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Diagram showing a question broken into research, analyze, and synthesize steps by a NextGen agent, producing a smart answer">
      <rect width="560" height="200" fill="#EAE8FD"/>

      {/* Input */}
      <rect x="24" y="76" width="88" height="48" rx="8" fill="#fff" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="68" y="97" textAnchor="middle" fill="#737373" fontSize="11" fontFamily="Inter,system-ui" fontWeight="400">Your</text>
      <text x="68" y="113" textAnchor="middle" fill="#404040" fontSize="12" fontFamily="Inter,system-ui" fontWeight="600">question</text>

      <line x1="112" y1="100" x2="152" y2="100" stroke="#A39BF6" strokeWidth="1.5" strokeDasharray="4 3"/>
      <path d="M150 95L159 100L150 105Z" fill="#A39BF6"/>

      {/* Agent node */}
      <circle cx="200" cy="100" r="34" fill="rgba(115,103,240,.10)"/>
      <circle cx="200" cy="100" r="24" fill="rgba(115,103,240,.18)"/>
      <circle cx="200" cy="100" r="15" fill="#7367F0"/>
      <path d="M203 91l-7 10h5l-3 8 7-10h-5l3-8z" fill="#fff"/>
      <text x="200" y="148" textAnchor="middle" fill="#5C53C0" fontSize="9" fontFamily="Inter,system-ui" fontWeight="700" letterSpacing="0.08em">NEXTGEN</text>

      {/* Arrows out */}
      <line x1="217" y1="88" x2="258" y2="64"  stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M252 60L261 63L257 72Z" fill="#A39BF6"/>
      <line x1="220" y1="100" x2="265" y2="100" stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M263 95L272 100L263 105Z" fill="#A39BF6"/>
      <line x1="217" y1="112" x2="258" y2="136" stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M252 132L261 137L255 145Z" fill="#A39BF6"/>

      {/* Step boxes */}
      <rect x="272" y="42" width="88" height="36" rx="8" fill="#fff" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="316" y="57" textAnchor="middle" fill="#A3A3A3" fontSize="10" fontFamily="Inter,system-ui">Step 1</text>
      <text x="316" y="71" textAnchor="middle" fill="#404040" fontSize="11" fontFamily="Inter,system-ui" fontWeight="600">Research</text>

      <rect x="272" y="82" width="88" height="36" rx="8" fill="#fff" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="316" y="97" textAnchor="middle" fill="#A3A3A3" fontSize="10" fontFamily="Inter,system-ui">Step 2</text>
      <text x="316" y="111" textAnchor="middle" fill="#404040" fontSize="11" fontFamily="Inter,system-ui" fontWeight="600">Analyze</text>

      <rect x="272" y="122" width="88" height="36" rx="8" fill="#fff" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="316" y="137" textAnchor="middle" fill="#A3A3A3" fontSize="10" fontFamily="Inter,system-ui">Step 3</text>
      <text x="316" y="151" textAnchor="middle" fill="#404040" fontSize="11" fontFamily="Inter,system-ui" fontWeight="600">Synthesize</text>

      {/* Final answer */}
      <line x1="360" y1="100" x2="384" y2="100" stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M382 95L391 100L382 105Z" fill="#A39BF6"/>
      <rect x="392" y="72" width="88" height="56" rx="8" fill="#7367F0"/>
      <text x="436" y="95"  textAnchor="middle" fill="rgba(255,255,255,.80)" fontSize="11" fontFamily="Inter,system-ui">Smart</text>
      <text x="436" y="112" textAnchor="middle" fill="#fff" fontSize="12" fontFamily="Inter,system-ui" fontWeight="600">answer</text>
    </svg>
  );
}

export default function NextGenModal({ onEnable, onSkip, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-premium">

        {/* Illustration area */}
        <div className="modal-media" style={{ background: "#EAE8FD" }}>
          <ModalIllustration />
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          <span className="badge badge-primary" style={{ width: "fit-content" }}>
            <i className="ti ti-sparkles" />
            New feature
          </span>

          <h2 className="modal-heading">Meet NextGen</h2>

          <p className="modal-desc">
            NextGen lets your agent break down complex questions, plan multi-step tasks, and deliver smarter answers — automatically.
          </p>

          <ul className="modal-features">
            <li><i className="ti ti-check" />Multi-step reasoning across your knowledge base</li>
            <li><i className="ti ti-check" />Autonomous task planning per query</li>
            <li><i className="ti ti-check" />Deeper, more accurate answers</li>
          </ul>

          <div className="modal-actions">
            <button className="btn btn-primary btn-full" onClick={onEnable}>
              <i className="ti ti-bolt" />
              Enable NextGen
            </button>
            <button className="btn-notnow" style={{ textAlign: "center" }} onClick={onSkip}>
              Continue without NextGen
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
