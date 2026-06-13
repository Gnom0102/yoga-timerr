import styles from "./ProgressCircle.module.css";

interface ProgressCircleProps {
  progress: number;
  percentProgress?: number;
  remainingSeconds: number;
  label?: string;
  size?: number;
}

const formatTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function ProgressCircle({
  progress,
  percentProgress = progress,
  remainingSeconds,
  label = "Осталось",
  size = 360,
}: ProgressCircleProps) {
  const safeProgress = Math.min(1, Math.max(0, progress));
  const safePercentProgress = Math.min(1, Math.max(0, percentProgress));
  const safeSize = Math.max(220, size);
  const strokeWidth = 16;
  const radius = safeSize / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - safeProgress);
  const percent = Math.round(safePercentProgress * 100);

  return (
    <div
      className={styles.circle}
      style={{ width: safeSize, height: safeSize }}
      aria-label={`Прогресс практики ${percent}%`}
    >
      <svg
        className={styles.svg}
        width={safeSize}
        height={safeSize}
        viewBox={`0 0 ${safeSize} ${safeSize}`}
        role="img"
      >
        <circle
          className={styles.track}
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <circle
          className={styles.progress}
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <strong className={styles.time}>{formatTime(remainingSeconds)}</strong>
        <span className={styles.percent}>{percent}%</span>
      </div>
    </div>
  );
}
