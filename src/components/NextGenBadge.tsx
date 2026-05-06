interface Props {
  onClick?: () => void;
}

export default function NextGenBadge({ onClick }: Props) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="badge badge-primary"
        style={{ cursor: "pointer", border: "none" }}
        title="NextGen enabled — click to manage"
      >
        <i className="ti ti-bolt" />
        NextGen
      </button>
    );
  }
  return (
    <span className="badge badge-primary">
      <i className="ti ti-bolt" />
      NextGen
    </span>
  );
}
