interface Props {
  onClick?: () => void;
  size?: "sm" | "md";
}

const ICON = (
  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M7 1L3 7H6L5 11L9 5H6L7 1Z" fill="currentColor"/>
  </svg>
);

export default function NextGenBadge({ onClick, size = "md" }: Props) {
  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: size === "sm" ? "2px 8px" : "2px 10px",
    borderRadius: 4,
    background: "var(--cg-primary)",
    color: "#fff",
    font: `600 ${size === "sm" ? "10px" : "11px"}/16px var(--cg-font-sans)`,
    letterSpacing: ".02em",
    border: "none",
    transition: "background var(--cg-dur-fast)",
  };

  if (onClick) {
    return (
      <button onClick={onClick} style={{ ...style, cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--cg-primary-hover)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--cg-primary)")}
      >
        {ICON}
        NextGen
      </button>
    );
  }

  return <span style={style}>{ICON} NextGen</span>;
}
