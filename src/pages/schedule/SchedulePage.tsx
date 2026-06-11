import { calculateNextRun, type ScheduleRepeat } from "../../entities/schedule";
import type { YogaProgram } from "../../entities/program";
import { WEEKDAY_OPTIONS } from "../../shared/constants";
import {
  formatNextRun,
  getRepeatLabel,
  getWeekdaysLabel,
} from "../../shared/utils/formatSchedule";

import styles from "./SchedulePage.module.css";
import { useSchedulePage } from "./useSchedulePage";

interface SchedulePageProps {
  onOpenProgram?: (program: YogaProgram) => void;
}

export function SchedulePage({ onOpenProgram }: SchedulePageProps) {
  const {
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
  } = useSchedulePage();

  return (
    <main className={styles.page}>
      <section className={styles.schedule} aria-labelledby="schedule-title">
        <header className={styles.header}>
          <p className={styles.caption}>Schedule</p>
          <h1 id="schedule-title">Расписание занятий</h1>
          <p className={styles.description}>
            Запланируйте свой ритм практики: одиночный запуск, ежедневное или
            еженедельное повторение.
          </p>
        </header>

        <div className={styles.content}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="schedule-program">Практика</label>
              <select
                id="schedule-program"
                value={formState.programId}
                onChange={(e) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    programId: e.target.value,
                  }))
                }
              >
                {programs.length === 0 ? (
                  <option value="">Нет сохраненных практик</option>
                ) : (
                  programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name || "Без названия"}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="schedule-date">Начать с</label>
                <input
                  name=""
                  id="schedule-date"
                  type="date"
                  value={formState.startsAt}
                  onChange={(e) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      startAt: e.target.value,
                    }))
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="schedule-time">Время</label>
                <input
                  type="time"
                  name=""
                  id="schedule-time"
                  value={formState.time}
                  onChange={(e) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      time: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="schedule-repeat">Повторения</label>
              <select
                id="schedule-repeat"
                value={formState.repeat}
                onChange={(e) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    repeat: e.target.value as ScheduleRepeat,
                  }))
                }
              >
                <option value="once">Один раз</option>
                <option value="daily">Каждый день</option>
                <option value="weekly">Каждую неделю</option>
              </select>
            </div>

            {formState.repeat !== "once" ? (
              <div className={styles.field}>
                <label htmlFor="schedule-interval">Интервал</label>
                <input
                  id="schedule-interval"
                  min="1"
                  type="number"
                  value={formState.interval}
                  onChange={(e) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      interval: Number(e.target.value),
                    }))
                  }
                />
              </div>
            ) : null}

            {formState.repeat === "weekly" ? (
              <div className={styles.weekday} aria-label="Дни недели">
                {WEEKDAY_OPTIONS.map((weekday) => (
                  <button
                    key={weekday.value}
                    className={
                      formState.weekdays.includes(weekday.value)
                        ? styles.weekdayActive
                        : styles.weekday
                    }
                    type="button"
                    onClick={() => handleToggleWeekday(weekday.value)}
                  >
                    {weekday.label}
                  </button>
                ))}
              </div>
            ) : null}

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formState.enabled}
                onChange={(e) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    enabled: e.target.checked,
                  }))
                }
              />
              Активно
            </label>

            <div className={styles.actions}>
              <button
                className={styles.primaryButton}
                type="submit"
                disabled={programs.length === 0}
              >
                {editingScheduleId ? "Сохранить" : "Запланировать"}
              </button>

              {editingScheduleId ? (
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={handleResetForm}
                >
                  Отмена
                </button>
              ) : null}
            </div>
          </form>

          <div className={styles.list} aria-label="Список расписаний">
            {sortedSchedules.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.caption}>Пока пусто</p>
                <h2>Нет запланированных занятий</h2>
                <p>Выберите практику и задайте первый спокойный ритм.</p>
              </div>
            ) : (
              sortedSchedules.map((schedule) => {
                const program = programsById.get(schedule.programId);
                const nextRun = calculateNextRun(schedule);

                return (
                  <article className={styles.card} key={schedule.id}>
                    <div>
                      <p className={styles.caption}>
                        {schedule.enabled ? "Активно" : "Выключено"}
                      </p>
                      <h2>{program?.name || "Практика не найдена"}</h2>
                      <p className={styles.meta}>
                        {getRepeatLabel(
                          schedule.settings.repeat,
                          schedule.settings.interval,
                        )}
                        {schedule.settings.repeat === "weekly"
                          ? ` · ${getWeekdaysLabel(schedule.settings.weekdays)}`
                          : ""}
                        {" · "}
                        {schedule.settings.time}
                      </p>
                      <p className={styles.nextRun}>{formatNextRun(nextRun)}</p>
                    </div>

                    <div className={styles.cardActions}>
                      {program ? (
                        <button
                          className={styles.primaryButton}
                          type="button"
                          onClick={() => onOpenProgram?.(program)}
                        >
                          Запустить
                        </button>
                      ) : null}

                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        Изменить
                      </button>

                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => handleToggleSchedule(schedule)}
                      >
                        {schedule.enabled ? "Выключить" : "Включить"}
                      </button>

                      <button
                        className={styles.deleteButton}
                        type="button"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
