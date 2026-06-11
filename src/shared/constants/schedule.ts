import type { ScheduleRepeat, Weekday } from "../../entities/schedule";

export const WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export const DEFAULT_REMINDER_MINUTES_BEFORE = 10;

export const SCHEDULE_LOOKAHEAD_DAYS = 370;

export const DEFAULT_SCHEDULE_TIME = "09:00";
export const DEFAULT_SCHEDULE_INTERVAL = 1;
export const DEFAULT_SCHEDULE_WEEKDAYS: Weekday[] = [1, 3, 5];

export const SCHEDULE_REPEAT_OPTIONS: Array<{
  value: ScheduleRepeat;
  label: string;
}> = [
  { value: "once", label: "Один раз" },
  { value: "daily", label: "Каждый день" },
  { value: "weekly", label: "Каждую неделю" },
];

export const WEEKDAY_OPTIONS: Array<{
  value: Weekday;
  label: string;
}> = [
  { value: 1, label: "Пн" },
  { value: 2, label: "Вт" },
  { value: 3, label: "Ср" },
  { value: 4, label: "Чт" },
  { value: 5, label: "Пт" },
  { value: 6, label: "Сб" },
  { value: 0, label: "Вс" },
];
