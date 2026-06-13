export {
  createInitialTimerState,
  getCompletedPhaseSeconds,
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
} from "./timerEngine";
export type { TimerState, TimerStatus } from "./types";
