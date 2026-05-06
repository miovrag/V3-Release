"use client";

interface Props {
  onEnable: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function NextGenModal({ onEnable, onSkip, onClose }: Props) {
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
