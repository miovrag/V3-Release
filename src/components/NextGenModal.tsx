"use client";

interface Props {
  onEnable: () => void;
  onSkip: () => void;
  onClose: () => void;
}

function Illustration() {
  return (
    <svg width="100%" viewBox="0 0 476 160" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", borderRadius: "var(--radius-lg)" }}
      role="img"
      aria-label="Diagram: question enters NextGen agent, splits into Research, Analyze, Synthesize steps, produces a smart answer">
      <rect width="476" height="160" rx="12" fill="var(--brand-primary-tint)"/>

      {/* Input */}
      <rect x="20" y="60" width="84" height="40" rx="8" fill="var(--bg-surface)" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="62" y="78"  textAnchor="middle" fill="var(--text-muted)"  fontSize="10" fontFamily="Inter,system-ui" fontWeight="400">Your</text>
      <text x="62" y="93"  textAnchor="middle" fill="var(--text-body)"   fontSize="11" fontFamily="Inter,system-ui" fontWeight="600">question</text>

      <line x1="104" y1="80" x2="140" y2="80" stroke="#A39BF6" strokeWidth="1.5" strokeDasharray="4 3"/>
      <path d="M138 75L147 80L138 85Z" fill="#A39BF6"/>

      {/* Agent */}
      <circle cx="184" cy="80" r="32" fill="rgba(115,103,240,.10)"/>
      <circle cx="184" cy="80" r="22" fill="rgba(115,103,240,.20)"/>
      <circle cx="184" cy="80" r="14" fill="var(--brand-primary-default)"/>
      <path d="M187 72l-6 9h4l-2 7 6-9h-4l2-7z" fill="#fff"/>
      <text x="184" y="126" textAnchor="middle" fill="var(--brand-primary-active)" fontSize="8" fontFamily="Inter,system-ui" fontWeight="700" letterSpacing="0.08em">NEXTGEN</text>

      {/* Arrows */}
      <line x1="199" y1="69" x2="236" y2="48"  stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M230 44L239 47L235 56Z" fill="#A39BF6"/>
      <line x1="202" y1="80" x2="240" y2="80"  stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M238 75L247 80L238 85Z"  fill="#A39BF6"/>
      <line x1="199" y1="91" x2="236" y2="112" stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M230 108L239 113L233 121Z" fill="#A39BF6"/>

      {/* Steps */}
      <rect x="248" y="28" width="84" height="32" rx="8" fill="var(--bg-surface)" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="290" y="42"  textAnchor="middle" fill="var(--text-muted)" fontSize="9"  fontFamily="Inter,system-ui">Step 1</text>
      <text x="290" y="54"  textAnchor="middle" fill="var(--text-body)"  fontSize="10" fontFamily="Inter,system-ui" fontWeight="600">Research</text>

      <rect x="248" y="64" width="84" height="32" rx="8" fill="var(--bg-surface)" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="290" y="78"  textAnchor="middle" fill="var(--text-muted)" fontSize="9"  fontFamily="Inter,system-ui">Step 2</text>
      <text x="290" y="90"  textAnchor="middle" fill="var(--text-body)"  fontSize="10" fontFamily="Inter,system-ui" fontWeight="600">Analyze</text>

      <rect x="248" y="100" width="84" height="32" rx="8" fill="var(--bg-surface)" stroke="#D5D1FB" strokeWidth="1.5"/>
      <text x="290" y="114" textAnchor="middle" fill="var(--text-muted)" fontSize="9"  fontFamily="Inter,system-ui">Step 3</text>
      <text x="290" y="126" textAnchor="middle" fill="var(--text-body)"  fontSize="10" fontFamily="Inter,system-ui" fontWeight="600">Synthesize</text>

      {/* Final */}
      <line x1="332" y1="80" x2="356" y2="80" stroke="#A39BF6" strokeWidth="1.5"/>
      <path d="M354 75L363 80L354 85Z" fill="#A39BF6"/>
      <rect x="364" y="54" width="88" height="52" rx="8" fill="var(--brand-primary-default)"/>
      <text x="408" y="76"  textAnchor="middle" fill="rgba(255,255,255,.80)" fontSize="10" fontFamily="Inter,system-ui">Smart</text>
      <text x="408" y="91"  textAnchor="middle" fill="#fff" fontSize="11" fontFamily="Inter,system-ui" fontWeight="600">answer</text>
    </svg>
  );
}

export default function NextGenModal({ onEnable, onSkip, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-confirm" style={{ width: "min(560px, 100%)" }}>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          <i className="ti ti-x" />
        </button>

        {/* Illustration */}
        <Illustration />

        {/* Badge */}
        <span className="badge badge-primary" style={{ width: "fit-content" }}>
          <i className="ti ti-sparkles" />
          New feature
        </span>

        {/* Heading + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <h2 className="modal-confirm-title">Meet NextGen</h2>
          <p className="modal-desc">
            NextGen lets your agent break down complex questions, plan multi-step tasks, and deliver smarter answers — automatically.
          </p>
        </div>

        {/* Feature list */}
        <ul className="modal-features">
          <li><i className="ti ti-check" />Multi-step reasoning across your knowledge base</li>
          <li><i className="ti ti-check" />Autonomous task planning per query</li>
          <li><i className="ti ti-check" />Deeper, more accurate answers</li>
        </ul>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={onEnable}>
            <i className="ti ti-bolt" />
            Enable NextGen
          </button>
          <button className="btn-notnow" style={{ textAlign: "center" }} onClick={onSkip}>
            Continue without NextGen
          </button>
        </div>

      </div>
    </div>
  );
}
