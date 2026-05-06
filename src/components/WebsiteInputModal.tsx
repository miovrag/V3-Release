"use client";

interface Props {
  onNext: () => void;
  onClose: () => void;
}

export default function WebsiteInputModal({ onNext, onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-premium" style={{ flexDirection: "column" }}>
        <button className="modal-close" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: "var(--spacing-lg)", right: "var(--spacing-lg)" }}>
          <i className="ti ti-x" />
        </button>

        <div className="modal-body" style={{ gap: "var(--spacing-lg)" }}>
          <h2 className="modal-heading">Build using your website</h2>

          <div className="field">
            <label className="field-label">Enter your website URL or sitemap to start</label>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <input
                className="field-input"
                type="text"
                defaultValue="https://example.com"
                placeholder="https://your-site.com"
              />
              <div className="spinner" />
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={onNext}>
            Create agent
          </button>
        </div>
      </div>
    </div>
  );
}
