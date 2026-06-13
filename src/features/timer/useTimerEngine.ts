import { useCallback, useEffect, useMemo, useState } from "react";

import type { YogaPhase, YogaProgram } from "../../entities/program";
import {
  createInitialTimerState,
  getCurrentPhase,
  getNextPhase,
  getPhaseRemainingSeconds,
  getProgramElapsedSeconds,
  getProgramRemainingSeconds,
  getTimerProgress,
  goToNextPhase,
  pauseTimer,
  resetCurrentPhaseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
  tickTimer,
  type TimerState,
} from "../../entities/timer";
import { TIMER_TICK_MS } from "../../shared/constants";

export interface UseTimerEngineResult {
  state: TimerState;
  currentPhase: YogaPhase | undefined;
  nextPhase: YogaPhase | undefined;
  phaseRemainingSeconds: number;
  programElapsedSeconds: number;
  programRemainingSeconds: number;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  resetCurrentPhase: () => void;
  next: () => void;
}

export const useTimerEngine = (program: YogaProgram): UseTimerEngineResult => {
  const [state, setState] = useState<TimerState>(() =>
    createInitialTimerState(),
  );

  useEffect(() => {
    if (state.status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => tickTimer(program, currentState));
    }, TIMER_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [program, state.status]);

  const start = useCallback(() => {
    setState((currentState) =>
      startTimer(program, undefined, currentState.currentPhaseIndex),
    );
  }, [program]);

  const pause = useCallback(() => {
    setState((currentState) => pauseTimer(currentState));
  }, []);

  const resume = useCallback(() => {
    setState((currentState) => resumeTimer(currentState));
  }, []);

  const reset = useCallback(() => {
    setState(resetTimer());
  }, []);

  const resetCurrentPhase = useCallback(() => {
    setState((currentState) => resetCurrentPhaseTimer(currentState));
  }, []);

  const next = useCallback(() => {
    setState((currentState) => goToNextPhase(program, currentState));
  }, [program]);

  return useMemo(
    () => ({
      state,
      currentPhase: getCurrentPhase(program, state),
      nextPhase: getNextPhase(program, state),
      phaseRemainingSeconds: getPhaseRemainingSeconds(program, state),
      programElapsedSeconds: getProgramElapsedSeconds(program, state),
      programRemainingSeconds: getProgramRemainingSeconds(program, state),
      progress: getTimerProgress(program, state),
      start,
      pause,
      resume,
      reset,
      resetCurrentPhase,
      next,
    }),
    [program, state, start, pause, resume, reset, resetCurrentPhase, next],
  );
};
