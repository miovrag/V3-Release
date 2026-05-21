"use client";

interface Props {
  targetPlan: "premium" | "enterprise";
  onClose: () => void;
}

const PLAN_CONFIG = {
  premium: {
    badge: "Premium · Enterprise Agents",
    heading: "Unlock deeper reasoning with Premium",
    desc: "Get up to 10 tasks per query — twice the depth of Standard. Your agent reasons through complex questions step by step.",
    features: [
      "Up to 10 tasks per query",
      "Priority response processing",
      "Advanced usage analytics",
    ],
    price: "Starts at $X/month",
    cta: "Upgrade to Premium",
    mediaGradient: "linear-gradient(140deg, var(--brand-primary-tint) 0%, #c8c3f9 100%)",
  },
  enterprise: {
    badge: "Enterprise · Enterprise Agents",
    heading: "Maximum reasoning depth with Enterprise",
    desc: "Unlock all 15 tasks per query for the most thorough AI responses — with custom limits and dedicated support.",
    features: [
      "Up to 15 tasks per query",
      "Custom task limits per agent",
      "Dedicated success manager",
    ],
    price: "Custom pricing",
    cta: "Contact sales",
    mediaGradient: "linear-gradient(140deg, #c8c3f9 0%, var(--brand-primary-default) 100%)",
  },
} as const;

export default function UpgradeModal({ targetPlan, onClose }: Props) {
  const cfg = PLAN_CONFIG[targetPlan];

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-premium" role="dialog" aria-modal="true">

        {/* Media */}
        <div className="modal-media" style={{
          background: cfg.mediaGradient,
          flex: "0 0 clamp(140px, 28vh, 220px)",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" />
          </button>
          <i className="ti ti-bolt" style={{
            fontSize: 64,
            color: "var(--brand-primary-default)",
            opacity: 0.25,
          }} />
        </div>

        {/* Content */}
        <div className="modal-body">
          <span className="badge-premium">
            <i className="ti ti-sparkles" style={{ fontSize: 12, marginRight: 4 }} />
            {cfg.badge}
          </span>

          <h2 className="modal-heading">{cfg.heading}</h2>

          <p className="modal-desc">{cfg.desc}</p>

          <ul className="modal-features">
            {cfg.features.map(f => (
              <li key={f}>
                <i className="ti ti-check" />
                {f}
              </li>
            ))}
          </ul>

          <p className="modal-price">{cfg.price}</p>

          <div className="modal-actions">
            <button className="btn-upgrade">
              {cfg.cta}
              <i className="ti ti-sparkles" style={{ fontSize: 14 }} />
            </button>
            <button className="btn-compare">Compare plans</button>
            <button className="btn-notnow" onClick={onClose}>Not now</button>
          </div>
        </div>

      </div>
    </div>
  );
}
