// file: src/pages/timer/TimerScreenPage.tsx

import type { YogaProgram } from "../../entities/program";
import { ProgressCircle, useTimerEngine } from "../../features/timer";
import { Button, Card } from "../../shared/ui";
import { UseTimerSounds } from "../../shared/hooks/useTimerSounds";

import styles from "./TimerScreen.module.css";

interface TimerScreenPageProps {
  program: YogaProgram;
  onBack?: () => void;
  onComplete?: () => void;
}

const formatShortTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function TimerScreenPage({
  program,
  onBack,
  onComplete,
}: TimerScreenPageProps) {
  const {
    state,
    currentPhase,
    nextPhase,
    phaseRemainingSeconds,
    programRemainingSeconds,
    progress,
    start,
    pause,
    resume,
    reset,
  } = useTimerEngine(program);

  const { playStartSound } = UseTimerSounds(state);

  const isIdle = state.status === "idle";
  const isRunning = state.status === "running";
  const isPaused = state.status === "paused";
  const isCompleted = state.status === "completed";

  const primaryLabel = isRunning
    ? "Пауза"
    : isPaused
      ? "Продолжить"
      : isCompleted
        ? "Завершить"
        : "Начать";

  const handlePrimaryClick = () => {
    if (isRunning) {
      pause();
      return;
    }

    if (isPaused) {
      resume();
      return;
    }

    if (isCompleted) {
      onComplete?.();
      return;
    }

    playStartSound();
    start();
  };

  return (
    <main className={styles.page}>
      <section className={styles.screen} aria-labelledby="timer-title">
        <header className={styles.header}>
          <Button variant="secondary" onClick={onBack}>
            Назад
          </Button>

          <div className={styles.heading}>
            <p className={styles.caption}>Практика</p>
            <h1 id="timer-title">{program.name || "Без названия"}</h1>
          </div>
        </header>

        <section className={styles.phaseBlock} aria-live="polite">
          <p className={styles.caption}>Текущий этап</p>
          <h2>{currentPhase?.name ?? "Готово к началу"}</h2>

          <p className={styles.phaseTime}>
            {isCompleted
              ? "Практика завершена"
              : `В этапе осталось ${formatShortTime(phaseRemainingSeconds)}`}
          </p>
        </section>

        <ProgressCircle
          progress={progress}
          remainingSeconds={programRemainingSeconds}
          label={isCompleted ? "Готово" : "Осталось"}
        />

        <Card
          as="section"
          className={styles.nextBlock}
          caption="Следующий этап"
          title={nextPhase?.name ?? "Завершение практики"}
        />

        <div className={styles.controls}>
          <Button size="large" fullWidth onClick={handlePrimaryClick}>
            {primaryLabel}
          </Button>

          {!isIdle && !isCompleted ? (
            <Button variant="secondary" size="large" onClick={reset}>
              Сброс
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
