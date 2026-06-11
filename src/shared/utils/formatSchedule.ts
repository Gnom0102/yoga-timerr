import { format, formatDistanceToNowStrict } from "date-fns";
import { ru } from "date-fns/locale";

import type { ScheduleRepeat, Weekday } from "../../entities/schedule";
import { WEEKDAY_OPTIONS } from "../constants";

export const formatNextRun = (date: Date | null) => {
  if (!date) {
    return "Следующий запуск не запланирован";
  }

  return `${format(date, "d MMMM yyyy, HH:mm", {
    locale: ru,
  })} · через ${formatDistanceToNowStrict(date, { locale: ru })}`;
};

export const getRepeatLabel = (repeat: ScheduleRepeat, interval: number) => {
  if (repeat === "once") {
    return "один раз";
  }

  if (repeat === "daily") {
    return interval === 1 ? "каждый день" : `каждые ${interval} дн.`;
  }

  return interval === 1 ? "каждую неделю" : `каждые ${interval} нед.`;
};

export const getWeekdaysLabel = (weekdays: Weekday[]) => {
  if (weekdays.length === 0) {
    return "любой день";
  }

  return WEEKDAY_OPTIONS.filter((option) => weekdays.includes(option.value))
    .map((option) => option.label)
    .join(", ");
};
