import type { EntityId, ISODateString } from "../../shared/types";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ScheduleRepeat = "once" | "daily" | "weekly";

export interface ScheduleSettings {
  startsAt: ISODateString;
  time: string;
  repeat: ScheduleRepeat;
  interval: number;
  weekdays: Weekday[];
  reminderEnabled: boolean;
  reminderMinutesBefore?: number;
}

export interface Schedule {
  id: EntityId;
  programId: EntityId;
  settings: ScheduleSettings;
  enabled: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
