import { useEffect, useState } from "react";

import type { YogaProgram } from "../../entities/program";
import { useTimerEngine } from "../../features/timer";
import { UseTimerSounds } from "../../shared/hooks/useTimerSounds";
import { audioService } from "../../shared/services";

import {
  NextStageCard,
  TimerCircle,
  TimerControls,
  TimerHeader,
  TimerPageLayout,
  TimerStageInfo,
} from "./components";

interface TimerScreenPageProps {
  program: YogaProgram;
  onBack?: () => void;
  onComplete?: () => void;
}

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
    resetCurrentPhase,
    next,
  } = useTimerEngine(program);

  const { playStartSound } = UseTimerSounds(state);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const isIdle = state.status === "idle";
  const isRunning = state.status === "running";
  const isPaused = state.status === "paused";
  const isCompleted = state.status === "completed";

  useEffect(() => {
    audioService.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    audioService.setMuted(isMuted);
  }, [isMuted]);

  const phaseProgress = currentPhase
    ? 1 - phaseRemainingSeconds / currentPhase.durationSeconds
    : isCompleted
      ? 1
      : 0;

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
    <TimerPageLayout>
      <TimerHeader
        title={program.name || "Без названия"}
        onBack={onBack}
        onResetPhase={resetCurrentPhase}
        isResetPhaseDisabled={isCompleted}
        isMuted={isMuted}
        onToggleMuted={() => setIsMuted((currentValue) => !currentValue)}
        volume={volume}
        onVolumeChange={(nextVolume) => {
          setVolume(nextVolume);

          if (nextVolume > 0) {
            setIsMuted(false);
          }
        }}
      />

      <TimerStageInfo
        phaseName={currentPhase?.name ?? "Готово к началу"}
        practiceRemainingSeconds={programRemainingSeconds}
        isCompleted={isCompleted}
      />

      <TimerCircle
        progress={phaseProgress}
        percentProgress={progress}
        remainingSeconds={phaseRemainingSeconds}
        label={isCompleted ? "Готово" : "Этап"}
      />

      <NextStageCard
        title={nextPhase?.name ?? "Завершение практики"}
        durationSeconds={nextPhase?.durationSeconds}
        isDisabled={isCompleted}
      />

      <TimerControls
        primaryLabel={primaryLabel}
        onPrimaryClick={handlePrimaryClick}
        showReset={!isIdle && !isCompleted}
        onReset={reset}
        onNext={next}
        isNextDisabled={isCompleted}
      />
    </TimerPageLayout>
  );
}
