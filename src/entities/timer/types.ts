import type { DurationSeconds, ISODateString } from "../../shared/types";

export type TimerStatus = "idle" | "running" | "paused" | "completed";

export interface TimerState {
  status: TimerStatus;
  currentPhaseIndex: number;
  elapsedSeconds: DurationSeconds;
  startedAt?: ISODateString;
  pausedAt?: ISODateString;
  completedAt?: ISODateString;
}
