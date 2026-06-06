import type { YogaProgram } from "./types";

export const getProgramDuration = (program: YogaProgram) => {
  return program.phases.reduce((total, phase) => {
    return total + phase.durationSeconds;
  }, 0);
};
