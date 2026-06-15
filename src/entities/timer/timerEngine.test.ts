import { describe, expect, it } from "vitest";

import type { YogaProgram } from "../program";
import {
  getProgramElapsedSeconds,
  getProgramRemainingSeconds,
  getTimerProgress,
  startTimer,
  tickTimer,
} from "./timerEngine";

const program: YogaProgram = {
  id: "unit-program",
  name: "Unit Practice",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  phases: [
    {
      id: "breath",
      name: "Breath",
      type: "pranayama",
      durationSeconds: 30,
    },
    {
      id: "asana",
      name: "Asana",
      type: "asana",
      durationSeconds: 45,
    },
    {
      id: "rest",
      name: "Rest",
      type: "shavasana",
      durationSeconds: 15,
    },
  ],
};

describe("timerEngine", () => {
  it("перемещается по этапам, сохраняя при этом секунды заполнения", () => {
    const state = startTimer(program, "2026-06-15T06:00:00.000Z");

    const nextState = tickTimer(program, state, 35, "2026-06-15T06:00:35.000Z");

    expect(nextState).toMatchObject({
      status: "running",
      currentPhaseIndex: 1,
      elapsedSeconds: 5,
    });
    expect(getProgramElapsedSeconds(program, nextState)).toBe(35);
    expect(getProgramRemainingSeconds(program, nextState)).toBe(55);
    expect(getTimerProgress(program, nextState)).toBeCloseTo(35 / 90);
  });

  it("завершает программу, когда отметка проходит последнюю фазу", () => {
    const state = startTimer(program, "2026-06-15T06:00:00.000Z");

    const completedState = tickTimer(
      program,
      state,
      90,
      "2026-06-15T06:01:30.000Z",
    );

    expect(completedState).toMatchObject({
      status: "completed",
      currentPhaseIndex: 2,
      elapsedSeconds: 0,
      completedAt: "2026-06-15T06:01:30.000Z",
    });
    expect(getProgramElapsedSeconds(program, completedState)).toBe(90);
    expect(getProgramRemainingSeconds(program, completedState)).toBe(0);
    expect(getTimerProgress(program, completedState)).toBe(1);
  });
});
