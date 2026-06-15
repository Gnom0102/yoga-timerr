import { useEffect, useMemo, useState } from "react";

import { calculateNextRun, type Schedule } from "./entities/schedule";
import { getProgramDuration, type YogaProgram } from "./entities/program";
import { programRepository, scheduleRepository } from "./shared/repositories";
import { formatDuration } from "./shared/utils/formatDuration";

import "./App.css";

type AppScreen = "programs" | "schedule";

interface AppSidebarProps {
  activeScreen: AppScreen;
  sidebarVersion: number;
  onOpenPrograms: () => void;
  onOpenSchedule: () => void;
}

export function AppSidebar({
  activeScreen,
  sidebarVersion,
  onOpenPrograms,
  onOpenSchedule,
}: AppSidebarProps) {
  const [programs, setPrograms] = useState<YogaProgram[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    Promise.all([programRepository.getAll(), scheduleRepository.getAll()]).then(
      ([storedPrograms, storedSchedules]) => {
        setPrograms(storedPrograms);
        setSchedules(storedSchedules);
      },
    );
  }, [sidebarVersion]);

  const programsById = useMemo(() => {
    return new Map(programs.map((program) => [program.id, program]));
  }, [programs]);

  const todaySchedules = useMemo(() => {
    const now = new Date();

    return schedules
      .filter((schedule) => {
        const nextRun = calculateNextRun(schedule, now);

        return Boolean(nextRun && isSameLocalDay(nextRun, now));
      })
      .sort((a, b) => a.settings.time.localeCompare(b.settings.time));
  }, [schedules]);

  return (
    <aside className="appSidebar" aria-label="Боковая навигация">
      <div className="appLogo">
        <LotusIcon />
        <span>Yoga Timer</span>
      </div>

      <nav className="appSideNav" aria-label="Основная навигация">
        <button
          className={
            activeScreen === "programs"
              ? "appSideNavActive"
              : "appSideNavButton"
          }
          type="button"
          onClick={onOpenPrograms}
        >
          <LeafIcon />
          <span>Практики</span>
        </button>

        <button
          className={
            activeScreen === "schedule"
              ? "appSideNavActive"
              : "appSideNavButton"
          }
          type="button"
          onClick={onOpenSchedule}
        >
          <CalendarIcon />
          <span>Расписание</span>
        </button>
      </nav>

      <section className="appTodayCard" aria-label="Практики на сегодня">
        <div className="appTodayHeader">
          <span>Сегодня</span>
          <span>{getPracticeCountLabel(todaySchedules.length)}</span>
        </div>

        {todaySchedules.length > 0 ? (
          todaySchedules.map((schedule) => {
            const program = programsById.get(schedule.programId);
            const duration = program
              ? formatDuration(getProgramDuration(program))
              : "";

            return (
              <div className="appTodayRow" key={schedule.id}>
                <span>{program?.name || "Практика не найдена"}</span>
                {duration ? <span>{duration}</span> : null}
              </div>
            );
          })
        ) : (
          <p className="appTodayEmpty">Сегодня практик не запланировано</p>
        )}

        <button
          className="appNewPracticeButton"
          type="button"
          onClick={onOpenSchedule}
        >
          <span aria-hidden="true">+</span>
          <span>Новая практика</span>
        </button>
      </section>

      <button className="appSoundButton" type="button">
        <span>♪ Звук: тибетская чаша</span>
        <span aria-hidden="true">›</span>
      </button>
    </aside>
  );
}

function isSameLocalDay(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function getPracticeCountLabel(count: number) {
  if (count === 0) {
    return "0 практик";
  }

  if (count === 1) {
    return "1 практика";
  }

  if (count >= 2 && count <= 4) {
    return `${count} практики`;
  }

  return `${count} практик`;
}

function LotusIcon() {
  return (
    <svg
      className="appLogoSvg"
      aria-hidden="true"
      fill="none"
      viewBox="0 0 64 48"
    >
      <path d="M32 42C20 32 20 17 32 5c12 12 12 27 0 37Z" />
      <path d="M31 42C17 39 8 29 8 14c14 3 23 13 23 28Z" />
      <path d="M33 42c14-3 23-13 23-28-14 3-23 13-23 28Z" />
      <path d="M32 42C21 45 11 42 3 34c11-3 21 0 29 8Z" />
      <path d="M32 42c11 3 21 0 29-8-11-3-21 0-29 8Z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M20 4C10 4 5 9 5 19c10 0 15-5 15-15Z" />
      <path d="M5 19 15 9" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
    </svg>
  );
}
