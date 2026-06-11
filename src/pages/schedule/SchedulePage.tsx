import { calculateNextRun, type ScheduleRepeat } from "../../entities/schedule";
import type { YogaProgram } from "../../entities/program";
import { WEEKDAY_OPTIONS } from "../../shared/constants";
import { Button, Card, Input, PageLayout } from "../../shared/ui";
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
    <PageLayout
      caption="Schedule"
      title="Расписание занятий"
      description="Запланируйте свой ритм практики: одиночный запуск, ежедневное или еженедельное повторение."
    >
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="schedule-program">Практика</label>
            <select
              id="schedule-program"
              className={styles.select}
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
            <Input
              id="schedule-date"
              label="Начать с"
              type="date"
              value={formState.startsAt}
              onChange={(e) =>
                setFormState((currentState) => ({
                  ...currentState,
                  startsAt: e.target.value,
                }))
              }
            />

            <Input
              id="schedule-time"
              label="Время"
              type="time"
              value={formState.time}
              onChange={(e) =>
                setFormState((currentState) => ({
                  ...currentState,
                  time: e.target.value,
                }))
              }
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="schedule-repeat">Повторения</label>
            <select
              id="schedule-repeat"
              className={styles.select}
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
            <Input
              id="schedule-interval"
              label="Интервал"
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
          ) : null}

          {formState.repeat === "weekly" ? (
            <div className={styles.weekdays} aria-label="Дни недели">
              {WEEKDAY_OPTIONS.map((weekday) => (
                <Button
                  key={weekday.value}
                  variant={
                    formState.weekdays.includes(weekday.value)
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handleToggleWeekday(weekday.value)}
                >
                  {weekday.label}
                </Button>
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
            <Button type="submit" disabled={programs.length === 0}>
              {editingScheduleId ? "Сохранить" : "Запланировать"}
            </Button>

            {editingScheduleId ? (
              <Button variant="secondary" onClick={handleResetForm}>
                Отмена
              </Button>
            ) : null}
          </div>
        </form>

        <div className={styles.list} aria-label="Список расписаний">
          {sortedSchedules.length === 0 ? (
            <Card
              caption="Пока пусто"
              title="Нет запланированных занятий"
              description="Выберите практику и задайте первый спокойный ритм."
            />
          ) : (
            sortedSchedules.map((schedule) => {
              const program = programsById.get(schedule.programId);
              const nextRun = calculateNextRun(schedule);

              return (
                <Card
                  key={schedule.id}
                  caption={schedule.enabled ? "Активно" : "Выключено"}
                  title={program?.name || "Практика не найдена"}
                >
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

                  <div className={styles.cardActions}>
                    {program ? (
                      <Button onClick={() => onOpenProgram?.(program)}>
                        Запустить
                      </Button>
                    ) : null}

                    <Button
                      variant="secondary"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      Изменить
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => handleToggleSchedule(schedule)}
                    >
                      {schedule.enabled ? "Выключить" : "Включить"}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </PageLayout>
  );
}
