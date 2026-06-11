import type { Schedule } from "../../entities/schedule";
import type { EntityId } from "../types";
import { STORAGE_KEYS } from "../constants/storageKeys";

export interface ScheduleRepository {
  getAll(): Promise<Schedule[]>;
  getById(id: EntityId): Promise<Schedule | null>;
  getByProgramId(programId: EntityId): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<void>;
  update(schedule: Schedule): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isSchedule = (value: unknown): value is Schedule => {
  if (!isRecord(value) || !isRecord(value.settings)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.programId === "string" &&
    typeof value.enabled === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    typeof value.settings.startsAt === "string" &&
    typeof value.settings.time === "string" &&
    typeof value.settings.repeat === "string" &&
    typeof value.settings.interval === "number" &&
    Array.isArray(value.settings.weekdays) &&
    typeof value.settings.reminderEnabled === "boolean"
  );
};

const readSchedules = (): Schedule[] => {
  const rawSchedules = localStorage.getItem(STORAGE_KEYS.schedules);

  if (!rawSchedules) {
    return [];
  }

  try {
    const parsedSchedules: unknown = JSON.parse(rawSchedules);

    if (!Array.isArray(parsedSchedules)) {
      return [];
    }

    return parsedSchedules.filter(isSchedule);
  } catch {
    return [];
  }
};

const writeSchedules = (schedules: Schedule[]) => {
  localStorage.setItem(STORAGE_KEYS.schedules, JSON.stringify(schedules));
};

export const scheduleRepository: ScheduleRepository = {
  async getAll() {
    return readSchedules();
  },

  async getById(id) {
    return readSchedules().find((schedule) => schedule.id === id) ?? null;
  },

  async getByProgramId(programId) {
    return readSchedules().filter(
      (schedule) => schedule.programId === programId,
    );
  },

  async save(schedule) {
    const schedules = readSchedules();
    const scheduleIndex = schedules.findIndex(
      (item) => item.id === schedule.id,
    );

    if (scheduleIndex >= 0) {
      schedules[scheduleIndex] = schedule;
      writeSchedules(schedules);
      return;
    }

    writeSchedules([...schedules, schedule]);
  },

  async update(schedule) {
    const schedules = readSchedules();
    const nextSchedules = schedules.map((item) =>
      item.id === schedule.id ? schedule : item,
    );

    writeSchedules(nextSchedules);
  },

  async delete(id) {
    writeSchedules(readSchedules().filter((schedule) => schedule.id !== id));
  },
};
