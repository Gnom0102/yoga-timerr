import { describe, expect, it } from "vitest";

import type { Schedule } from "./types";
import { calculateNextRun } from "./calculateNextRun";

const createSchedule = (
  overrides: Partial<Schedule["settings"]> = {},
): Schedule => ({
  id: "schedule-1",
  programId: "program-1",
  enabled: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  settings: {
    startsAt: "2026-06-10T00:00:00.000Z",
    time: "09:00",
    repeat: "daily",
    interval: 1,
    weekdays: [],
    reminderEnabled: false,
    ...overrides,
  },
});

describe("calculateNextRun", () => {
  it("возвращает следующий ежедневный интервал по истечении запланированного на сегодня времени", () => {
    const now = new Date(2026, 5, 15, 10, 0, 0);
    const schedule = createSchedule({ interval: 2 });

    const nextRun = calculateNextRun(schedule, now);

    expect(nextRun).not.toBeNull();
    expect(nextRun?.getFullYear()).toBe(2026);
    expect(nextRun?.getMonth()).toBe(5);
    expect(nextRun?.getDate()).toBe(16);
    expect(nextRun?.getHours()).toBe(9);
    expect(nextRun?.getMinutes()).toBe(0);
  });

  it("находит следующий разрешенный день недели для еженедельного расписания", () => {
    const now = new Date(2026, 5, 15, 10, 0, 0);
    const schedule = createSchedule({
      repeat: "weekly",
      weekdays: [1, 3],
      time: "09:30",
    });

    const nextRun = calculateNextRun(schedule, now);

    expect(nextRun).not.toBeNull();
    expect(nextRun?.getFullYear()).toBe(2026);
    expect(nextRun?.getMonth()).toBe(5);
    expect(nextRun?.getDate()).toBe(17);
    expect(nextRun?.getHours()).toBe(9);
    expect(nextRun?.getMinutes()).toBe(30);
  });
});
