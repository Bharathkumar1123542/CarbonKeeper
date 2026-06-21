/**
 * Props for the ProgressBar component.
 * A styled progress bar with customizable track, fill, and height via Tailwind classes.
 */
interface ProgressBarProps {
  /** Current progress value between 0 and 100 */
  value: number;
  /** Tailwind class for the track (background) of the progress bar */
  trackClassName: string;
  /** Tailwind class for the filled portion of the progress bar */
  fillClassName: string;
  /** Tailwind height class for the progress bar (defaults to "h-3") */
  heightClassName?: string;
  /** Accessible label describing what the progress bar represents */
  ariaLabel?: string;
}

export function ProgressBar({
  value,
  trackClassName,
  fillClassName,
  heightClassName = "h-3",
  ariaLabel = "Budget usage percentage",
}: ProgressBarProps) {
  return (
    <div className={`${heightClassName} ${trackClassName} rounded-full overflow-hidden`}>
      <div
        className={`h-full ${fillClassName} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(value, 100)}%` }}
        role="meter"
        aria-label={ariaLabel}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
