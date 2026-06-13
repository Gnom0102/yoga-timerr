import type { YogaPhase, YogaProgram } from "../program";
import type { DurationSeconds, ISODateString } from "../../shared/types";
import type { TimerState } from "./types";

const FIRST_PHASE_INDEX = 0;
const ONE_SECOND: DurationSeconds = 1;

const clampPhaseIndex = (program: YogaProgram, phaseIndex: number): number => {
  if (program.phases.length === 0) {
    return FIRST_PHASE_INDEX;
  }

  return Math.min(
    Math.max(FIRST_PHASE_INDEX, phaseIndex),
    program.phases.length - 1,
  );
};

export const createInitialTimerState = (): TimerState => ({
  status: "idle",
  currentPhaseIndex: FIRST_PHASE_INDEX,
  elapsedSeconds: 0,
});

export const startTimer = (
  program: YogaProgram,
  now: ISODateString = new Date().toISOString(),
  initialPhaseIndex = FIRST_PHASE_INDEX,
): TimerState => {
  if (program.phases.length === 0) {
    return {
      status: "completed",
      currentPhaseIndex: FIRST_PHASE_INDEX,
      elapsedSeconds: 0,
      startedAt: now,
      completedAt: now,
    };
  }

  return {
    status: "running",
    currentPhaseIndex: clampPhaseIndex(program, initialPhaseIndex),
    elapsedSeconds: 0,
    startedAt: now,
  };
};

export const pauseTimer = (
  state: TimerState,
  now: ISODateString = new Date().toISOString(),
): TimerState => {
  if (state.status !== "running") {
    return state;
  }

  return {
    ...state,
    status: "paused",
    pausedAt: now,
  };
};

export const resumeTimer = (state: TimerState): TimerState => {
  if (state.status !== "paused") {
    return state;
  }

  return {
    ...state,
    status: "running",
    pausedAt: undefined,
  };
};

export const resetTimer = (): TimerState => createInitialTimerState();

export const resetCurrentPhaseTimer = (state: TimerState): TimerState => {
  if (state.status === "completed") {
    return state;
  }

  return {
    ...state,
    elapsedSeconds: 0,
  };
};

export const tickTimer = (
  program: YogaProgram,
  state: TimerState,
  seconds: DurationSeconds = ONE_SECOND,
  now: ISODateString = new Date().toISOString(),
): TimerState => {
  if (state.status !== "running" || program.phases.length === 0) {
    return state;
  }

  return advanceTimer(program, state, Math.max(0, seconds), now);
};

export const goToNextPhase = (
  program: YogaProgram,
  state: TimerState,
  now: ISODateString = new Date().toISOString(),
): TimerState => {
  if (state.status === "completed" || program.phases.length === 0) {
    return state;
  }

  const nextPhaseIndex = state.currentPhaseIndex + 1;
  const isLastPhase = nextPhaseIndex >= program.phases.length;

  if (isLastPhase) {
    return {
      ...state,
      status: "completed",
      currentPhaseIndex: Math.max(FIRST_PHASE_INDEX, program.phases.length - 1),
      elapsedSeconds: 0,
      pausedAt: undefined,
      completedAt: now,
    };
  }

  return {
    ...state,
    currentPhaseIndex: nextPhaseIndex,
    elapsedSeconds: 0,
  };
};

export const getCurrentPhase = (
  program: YogaProgram,
  state: TimerState,
): YogaPhase | undefined => program.phases[state.currentPhaseIndex];

export const getNextPhase = (
  program: YogaProgram,
  state: TimerState,
): YogaPhase | undefined => program.phases[state.currentPhaseIndex + 1];

export const getPhaseRemainingSeconds = (
  program: YogaProgram,
  state: TimerState,
): DurationSeconds => {
  const currentPhase = getCurrentPhase(program, state);

  if (!currentPhase || state.status === "completed") {
    return 0;
  }

  return Math.max(0, currentPhase.durationSeconds - state.elapsedSeconds);
};

export const getCompletedPhaseSeconds = (
  program: YogaProgram,
  state: TimerState,
): DurationSeconds => {
  return program.phases
    .slice(0, state.currentPhaseIndex)
    .reduce((total, phase) => total + phase.durationSeconds, 0);
};

export const getProgramElapsedSeconds = (
  program: YogaProgram,
  state: TimerState,
): DurationSeconds => {
  if (state.status === "completed") {
    return getProgramTotalSeconds(program);
  }

  return getCompletedPhaseSeconds(program, state) + state.elapsedSeconds;
};

export const getProgramRemainingSeconds = (
  program: YogaProgram,
  state: TimerState,
): DurationSeconds => {
  return Math.max(
    0,
    getProgramTotalSeconds(program) - getProgramElapsedSeconds(program, state),
  );
};

export const getTimerProgress = (
  program: YogaProgram,
  state: TimerState,
): number => {
  const totalSeconds = getProgramTotalSeconds(program);

  if (totalSeconds === 0) {
    return state.status === "completed" ? 1 : 0;
  }

  return getProgramElapsedSeconds(program, state) / totalSeconds;
};

const advanceTimer = (
  program: YogaProgram,
  state: TimerState,
  seconds: DurationSeconds,
  now: ISODateString,
): TimerState => {
  let currentPhaseIndex = state.currentPhaseIndex;
  let elapsedSeconds = state.elapsedSeconds + seconds;

  while (currentPhaseIndex < program.phases.length) {
    const phase = program.phases[currentPhaseIndex];

    if (elapsedSeconds < phase.durationSeconds) {
      return {
        ...state,
        currentPhaseIndex,
        elapsedSeconds,
      };
    }

    elapsedSeconds -= phase.durationSeconds;
    currentPhaseIndex += 1;
  }

  return {
    ...state,
    status: "completed",
    currentPhaseIndex: Math.max(FIRST_PHASE_INDEX, program.phases.length - 1),
    elapsedSeconds: 0,
    completedAt: now,
  };
};

const getProgramTotalSeconds = (program: YogaProgram): DurationSeconds => {
  return program.phases.reduce(
    (total, phase) => total + phase.durationSeconds,
    0,
  );
};
