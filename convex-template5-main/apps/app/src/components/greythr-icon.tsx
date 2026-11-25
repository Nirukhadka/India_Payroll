export function GreytHRIcon({
  className = "text-cyan-500",
}: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 2L21 12L12 22L3 12Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
