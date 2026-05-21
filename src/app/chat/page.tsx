import ChatWindow from "@/components/ChatWindow";

export const metadata = {
  title: "Post-creation flow — CustomGPT.ai",
};

export default function ChatPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-canvas)", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{
        height: 56, flexShrink: 0,
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
        display: "flex", alignItems: "center",
        padding: "0 var(--spacing-xl)", gap: "var(--spacing-sm)",
      }}>
        <i className="ti ti-robot" style={{ fontSize: 20, color: "var(--brand-primary-default)" }} />
        <span style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-bold)", color: "var(--text-heading)" }}>
          CustomGPT.ai
        </span>
        <span className="badge badge-primary" style={{ marginLeft: "var(--spacing-xs)" }}>
          Post-creation flow
        </span>
      </header>

      {/* Chat window — centered, max 520px */}
      <main style={{
        flex: 1,
        display: "flex", justifyContent: "center",
        padding: "var(--spacing-xl)",
      }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <ChatWindow />
        </div>
      </main>

    </div>
  );
}
