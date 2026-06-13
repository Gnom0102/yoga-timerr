import styles from "../TimerScreen.module.css";

interface TimerStageInfoProps {
  phaseName: string;
  practiceRemainingSeconds: number;
  isCompleted: boolean;
}

const formatShortTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function TimerStageInfo({
  phaseName,
  practiceRemainingSeconds,
  isCompleted,
}: TimerStageInfoProps) {
  return (
    <section className={styles.phaseBlock} aria-live="polite">
      <p className={styles.caption}>Текущий этап</p>
      <h2>{phaseName}</h2>

      <p className={styles.phaseTime}>
        {isCompleted
          ? "Практика завершена"
          : `В практике осталось ${formatShortTime(practiceRemainingSeconds)}`}
      </p>
    </section>
  );
}
