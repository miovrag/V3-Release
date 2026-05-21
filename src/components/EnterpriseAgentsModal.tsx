"use client";

type Plan = "standard" | "premium" | "enterprise";

const PLAN_CONFIG: Record<Plan, { label: string; tasks: number; next?: string }> = {
  standard:  { label: "Standard",   tasks: 5,  next: "Premium" },
  premium:   { label: "Premium",    tasks: 10, next: "Enterprise" },
  enterprise:{ label: "Enterprise", tasks: 15 },
};

interface Props {
  onEnable: () => void;
  onSkip: () => void;
  onClose: () => void;
  plan?: Plan;
  onUpgrade?: () => void;
}

export default function EnterpriseAgentsModal({ onEnable, onSkip, onClose, plan = "standard", onUpgrade }: Props) {
  const cfg = PLAN_CONFIG[plan];

  return (
    <div className="modal-overlay">
      <div className="modal-confirm" style={{ width: "min(560px, 100%)" }}>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          <i className="ti ti-x" />
        </button>

        {/* Badge */}
        <span className="badge-premium">
          <i className="ti ti-sparkles" style={{ fontSize: 14 }} />
          New feature
        </span>

        {/* Heading + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <h2 className="modal-confirm-title">Meet Enterprise Agents</h2>
          <p className="modal-desc">
            Enterprise Agents lets your agent break down complex questions, plan multi-step tasks, and deliver smarter answers — automatically.
          </p>
        </div>

        {/* Feature list */}
        <ul className="modal-features">
          <li><i className="ti ti-check" />Multi-step reasoning across your knowledge base</li>
          <li><i className="ti ti-check" />Autonomous task planning per query</li>
          <li><i className="ti ti-check" />Deeper, more accurate answers</li>
        </ul>

        {/* Plan context */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "var(--spacing-md) var(--spacing-lg)",
          background: "var(--bg-canvas)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-default)",
          gap: "var(--spacing-md)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
            <i className="ti ti-bolt" style={{ color: "var(--brand-primary-default)", fontSize: 16, flexShrink: 0 }} />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-body)" }}>
              Your <strong>{cfg.label}</strong> plan includes up to <strong>{cfg.tasks} tasks</strong> per query.
            </span>
          </div>
          {cfg.next && (
            <button
              onClick={onUpgrade}
              style={{
                background: "none", border: "none", padding: 0,
                fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)",
                color: "var(--brand-primary-default)", cursor: "pointer",
                whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              Upgrade for more →
            </button>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <button className="btn btn-primary btn-lg btn-full" onClick={onEnable}>
            <i className="ti ti-bolt" />
            Enable Enterprise Agents
          </button>
          <button className="btn-notnow" style={{ textAlign: "center" }} onClick={onSkip}>
            Continue without Enterprise Agents
          </button>
        </div>

      </div>
    </div>
  );
}
