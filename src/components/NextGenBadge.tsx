interface Props {
  onClick?: () => void;
  size?: "sm" | "md";
}

export default function NextGenBadge({ onClick, size = "md" }: Props) {
  const base =
    "inline-flex items-center gap-1 rounded-full font-semibold transition-colors bg-gradient-to-r from-[#5B4FE8] to-[#8B7FFF] text-white";
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  if (onClick) {
    return (
      <button onClick={onClick} className={`${base} ${sizes[size]} hover:opacity-80 cursor-pointer`}>
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
          <path d="M7 1L3 7H6L5 11L9 5H6L7 1Z" fill="white"/>
        </svg>
        NextGen
      </button>
    );
  }

  return (
    <span className={`${base} ${sizes[size]}`}>
      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
        <path d="M7 1L3 7H6L5 11L9 5H6L7 1Z" fill="white"/>
      </svg>
      NextGen
    </span>
  );
}
