interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Branded spinning loader with the Assamese diamond motif weaving in a circle.
 * Tailwind animate-spin handles the rotation; gradient + stroke-dasharray gives
 * it the "fabric thread" feel.
 */
export default function Spinner({
  size = 32,
  className = "",
  label,
}: SpinnerProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="animate-spin"
      >
        <defs>
          <linearGradient id="kg-spinner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CC0000" />
            <stop offset="60%" stopColor="#C5A258" />
            <stop offset="100%" stopColor="#CC0000" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#FFEDD5"
          strokeWidth="4"
          opacity="0.5"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#kg-spinner)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 70"
        />
      </svg>
      {label && (
        <p className="text-xs text-muted-foreground tracking-wider uppercase">
          {label}
        </p>
      )}
    </div>
  );
}
