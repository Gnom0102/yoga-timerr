import { SCHEDULE_LOOKAHEAD_DAYS } from "../../shared/constants";

import {
  addDays,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  getDay,
  isAfter,
  isBefore,
  set,
  startOfDay,
  startOfMinute,
} from "date-fns";

import type { Schedule, ScheduleSettings, Weekday } from "./types";

const normalizeInterval = (interval: number) => {
  return Math.max(1, Math.floor(interval));
};

const parseTime = (time: string) => {
  const [hoursValue, minutesValue] = time.split(":");
  const hours = Number(hoursValue);
  const minutes = Number(minutesValue);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return { hours: 9, minutes: 0 };
  }

  return { hours, minutes };
};

const applyTime = (date: Date, time: string) => {
  const { hours, minutes } = parseTime(time);

  return startOfMinute(
    set(date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    }),
  );
};

const isSameOrAfter = (date: Date, start: Date) => {
  return !isBefore(date, start);
};

const isAllowedWeekday = (weekday: number, weekdays: Weekday[]) => {
  return weekdays.length === 0 || weekdays.includes(weekday as Weekday);
};

const calculateOnceRun = (settings: ScheduleSettings, now: Date) => {
  const startsAt = new Date(settings.startsAt);
  const candidate = applyTime(startsAt, settings.time);

  return isAfter(candidate, now) ? candidate : null;
};

const calculateDailyRun = (settings: ScheduleSettings, now: Date) => {
  const startsAt = new Date(settings.startsAt);
  const startCandidate = applyTime(startsAt, settings.time);
  const interval = normalizeInterval(settings.interval);

  if (isAfter(startCandidate, now)) {
    return startCandidate;
  }

  const daysPassed = Math.max(
    0,
    differenceInCalendarDays(startOfDay(now), startOfDay(startsAt)),
  );

  const daysToNextInterval = interval - (daysPassed % interval);
  let candidate = applyTime(
    addDays(startsAt, daysToNextInterval),
    settings.time,
  );

  if (!isAfter(candidate, now)) {
    candidate = addDays(candidate, interval);
  }

  return candidate;
};

const calculateWeeklyRun = (settings: ScheduleSettings, now: Date) => {
  const startsAt = new Date(settings.startsAt);
  const interval = normalizeInterval(settings.interval);

  for (
    let dayOffset = 0;
    dayOffset <= SCHEDULE_LOOKAHEAD_DAYS;
    dayOffset += 1
  ) {
    const day = addDays(startOfDay(now), dayOffset);
    const candidate = applyTime(day, settings.time);
    const weeksPassed = differenceInCalendarWeeks(day, startsAt, {
      weekStartsOn: 1,
    });

    if (
      isSameOrAfter(candidate, startsAt) &&
      isAfter(candidate, now) &&
      weeksPassed >= 0 &&
      weeksPassed % interval === 0 &&
      isAllowedWeekday(getDay(candidate), settings.weekdays)
    ) {
      return candidate;
    }
  }

  return null;
};

export const calculateNextRun = (schedule: Schedule, now = new Date()) => {
  if (!schedule.enabled) {
    return null;
  }

  if (Number.isNaN(new Date(schedule.settings.startsAt).getTime())) {
    return null;
  }

  switch (schedule.settings.repeat) {
    case "once":
      return calculateOnceRun(schedule.settings, now);
    case "daily":
      return calculateDailyRun(schedule.settings, now);
    case "weekly":
      return calculateWeeklyRun(schedule.settings, now);
    default:
      return null;
  }
};
