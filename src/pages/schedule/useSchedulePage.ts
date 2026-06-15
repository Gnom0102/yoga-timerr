import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

import {
  calculateNextRun,
  type Schedule,
  type ScheduleRepeat,
  type Weekday,
} from "../../entities/schedule";
import type { YogaProgram } from "../../entities/program";
import {
  DEFAULT_SCHEDULE_INTERVAL,
  DEFAULT_SCHEDULE_TIME,
  DEFAULT_SCHEDULE_WEEKDAYS,
} from "../../shared/constants";
import {
  programRepository,
  scheduleRepository,
} from "../../shared/repositories";

export interface ScheduleFormState {
  programId: string;
  startsAt: string;
  time: string;
  repeat: ScheduleRepeat;
  interval: number;
  weekdays: Weekday[];
  enabled: boolean;
}

interface UseSchedulePageOptions {
  onScheduleChange?: () => void;
}

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getTodayInputValue = () => {
  return format(new Date(), "yyyy-MM-dd");
};

const getInitialFormState = (): ScheduleFormState => ({
  programId: "",
  startsAt: getTodayInputValue(),
  time: DEFAULT_SCHEDULE_TIME,
  repeat: "weekly",
  interval: DEFAULT_SCHEDULE_INTERVAL,
  weekdays: DEFAULT_SCHEDULE_WEEKDAYS,
  enabled: true,
});

export const useSchedulePage = ({
  onScheduleChange,
}: UseSchedulePageOptions = {}) => {
  const [programs, setPrograms] = useState<YogaProgram[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null,
  );
  const [formState, setFormState] =
    useState<ScheduleFormState>(getInitialFormState);

  const programsById = useMemo(() => {
    return new Map(programs.map((program) => [program.id, program]));
  }, [programs]);

  const sortedSchedules = useMemo(() => {
    return [...schedules].sort((a, b) => {
      const nextA = calculateNextRun(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const nextB = calculateNextRun(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;

      return nextA - nextB;
    });
  }, [schedules]);

  useEffect(() => {
    Promise.all([programRepository.getAll(), scheduleRepository.getAll()]).then(
      ([storedPrograms, storedSchedules]) => {
        setPrograms(storedPrograms);
        setSchedules(storedSchedules);

        setFormState((currentState) => ({
          ...currentState,
          programId: storedPrograms[0]?.id ?? "",
        }));
      },
    );
  }, []);

  const handleToggleWeekday = (weekday: Weekday) => {
    setFormState((currentState) => {
      const hasWeekday = currentState.weekdays.includes(weekday);

      return {
        ...currentState,
        weekdays: hasWeekday
          ? currentState.weekdays.filter((item) => item !== weekday)
          : [...currentState.weekdays, weekday],
      };
    });
  };

  const handleResetForm = () => {
    setEditingScheduleId(null);

    setFormState({
      ...getInitialFormState(),
      programId: programs[0]?.id ?? "",
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingScheduleId(schedule.id);

    setFormState({
      programId: schedule.programId,
      startsAt: format(new Date(schedule.settings.startsAt), "yyyy-MM-dd"),
      time: schedule.settings.time,
      repeat: schedule.settings.repeat,
      interval: schedule.settings.interval,
      weekdays: schedule.settings.weekdays,
      enabled: schedule.enabled,
    });
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    const shouldDelete = window.confirm("Удалить это расписание?");

    if (!shouldDelete) {
      return;
    }

    await scheduleRepository.delete(scheduleId);
    onScheduleChange?.();

    setSchedules((currentSchedules) =>
      currentSchedules.filter((schedule) => schedule.id !== scheduleId),
    );

    if (editingScheduleId === scheduleId) {
      handleResetForm();
    }
  };

  const handleToggleSchedule = async (schedule: Schedule) => {
    const updatedSchedule: Schedule = {
      ...schedule,
      enabled: !schedule.enabled,
      updatedAt: new Date().toISOString(),
    };

    await scheduleRepository.update(updatedSchedule);
    onScheduleChange?.();

    setSchedules((currentSchedules) =>
      currentSchedules.map((item) =>
        item.id === schedule.id ? updatedSchedule : item,
      ),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.programId) {
      return;
    }

    const now = new Date().toISOString();
    const existingSchedule = editingScheduleId
      ? schedules.find((schedule) => schedule.id === editingScheduleId)
      : null;

    const schedule: Schedule = {
      id: existingSchedule?.id ?? createId(),
      programId: formState.programId,
      enabled: formState.enabled,
      settings: {
        startsAt: new Date(formState.startsAt).toISOString(),
        time: formState.time,
        repeat: formState.repeat,
        interval: formState.interval,
        weekdays: formState.repeat === "weekly" ? formState.weekdays : [],
        reminderEnabled: false,
      },
      createdAt: existingSchedule?.createdAt ?? now,
      updatedAt: now,
    };

    if (existingSchedule) {
      await scheduleRepository.update(schedule);
      onScheduleChange?.();

      setSchedules((currentSchedules) =>
        currentSchedules.map((item) =>
          item.id === schedule.id ? schedule : item,
        ),
      );
    } else {
      await scheduleRepository.save(schedule);
      onScheduleChange?.();

      setSchedules((currentSchedules) => [...currentSchedules, schedule]);
    }

    handleResetForm();
  };

  return {
    editingScheduleId,
    formState,
    programs,
    programsById,
    sortedSchedules,
    setFormState,
    handleDeleteSchedule,
    handleEditSchedule,
    handleResetForm,
    handleSubmit,
    handleToggleSchedule,
    handleToggleWeekday,
  };
};
