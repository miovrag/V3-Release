interface Props {
  onClick?: () => void;
}

export default function EnterpriseAgentsBadge({ onClick }: Props) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="badge badge-primary"
        style={{ cursor: "pointer", border: "none" }}
        title="Enterprise Agents enabled — click to manage"
      >
        <i className="ti ti-bolt" />
        Enterprise Agents
      </button>
    );
  }
  return (
    <span className="badge badge-primary">
      <i className="ti ti-bolt" />
      Enterprise Agents
    </span>
  );
}
