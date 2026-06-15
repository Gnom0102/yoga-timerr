import { useCallback, useEffect, useRef } from "react";
import type { TimerState } from "../../entities/timer";
import { audioService } from "../services";

export interface UseTimerSoundsResult {
  playStartSound: () => void;
}

export const useTimerSounds = (
  timerState: TimerState,
): UseTimerSoundsResult => {
  const previousStatusRef = useRef(timerState.status);
  const previousPhaseIndexRef = useRef(timerState.currentPhaseIndex);

  useEffect(() => {
    const previousStatus = previousStatusRef.current;
    const previousPhaseIndex = previousPhaseIndexRef.current;

    const becameCompleted =
      previousStatus !== "completed" && timerState.status === "completed";

    const changedRunningPhase =
      previousStatus === "running" &&
      timerState.status === "running" &&
      previousPhaseIndex !== timerState.currentPhaseIndex;

    if (becameCompleted) {
      audioService.playComplete();
    } else if (changedRunningPhase) {
      audioService.playPhaseChange();
    }

    previousStatusRef.current = timerState.status;
    previousPhaseIndexRef.current = timerState.currentPhaseIndex;
  }, [timerState.currentPhaseIndex, timerState.status]);

  const playStartSound = useCallback(() => {
    audioService.playStart();
  }, []);

  return {
    playStartSound,
  };
};
