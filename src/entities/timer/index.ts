export {
  createInitialTimerState,
  getCompletedPhaseSeconds,
  getCurrentPhase,
  getNextPhase,
  getPhaseRemainingSeconds,
  getProgramElapsedSeconds,
  getProgramRemainingSeconds,
  getTimerProgress,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
  tickTimer,
} from "./timerEngine";
export type { TimerState, TimerStatus } from "./types";
