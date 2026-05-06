"use client";

interface Props {
  onNext: () => void;
  onClose: () => void;
}

export default function WebsiteInputModal({ onNext, onClose }: Props) {
  return (
    <div className="cg-overlay">
      <div className="cg-modal" style={{ maxWidth: 480 }}>
        <button className="cg-modal-close" onClick={onClose} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{ padding: "32px 32px 28px" }}>
          <h3 className="cg-h3" style={{ marginBottom: 4 }}>Build using your website</h3>
          <hr className="cg-divider" style={{ margin: "16px 0" }} />

          <label style={{
            display: "block",
            font: "500 13px/18px var(--cg-font-sans)",
            color: "var(--cg-fg-3)",
            marginBottom: 8,
          }}>
            Enter your website URL or sitemap to start:
          </label>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="cg-input"
              type="text"
              defaultValue="https://example.com"
            />
            <div className="cg-spinner" />
          </div>

          <button
            className="btn primary lg full"
            style={{ marginTop: 24 }}
            onClick={onNext}
          >
            Create agent
          </button>
        </div>
      </div>
    </div>
  );
}
