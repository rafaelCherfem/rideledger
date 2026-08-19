interface RoadDividerProps {
  className?: string;
}

export function RoadDivider({ className = "" }: RoadDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`h-[3px] w-full rounded-full ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, hsl(var(--card)) 0 14px, transparent 14px 26px)",
        opacity: 0.55,
      }}
    />
  );
}
