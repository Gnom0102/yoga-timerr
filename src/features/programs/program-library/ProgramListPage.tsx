import { useEffect, useMemo, useState } from "react";

import { formatDuration } from "../../../shared/utils/formatDuration";
import {
  programRepository,
  scheduleRepository,
} from "../../../shared/repositories";
import { ProgramCard } from "./ProgramCard";
import {
  getProgramDuration,
  type YogaProgram,
} from "../../../entities/program";
import { Card, PageLayout } from "../../../shared/ui";

import styles from "./ProgramListPage.module.css";

interface ProgramListPageProps {
  onOpenProgram?: (program: YogaProgram) => void;
}

export function ProgramListPage({ onOpenProgram }: ProgramListPageProps) {
  const [programs, setPrograms] = useState<YogaProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<YogaProgram | null>(
    null,
  );

  const sortedPrograms = useMemo(() => {
    return [...programs].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [programs]);

  useEffect(() => {
    programRepository.getAll().then(setPrograms);
  }, []);

  const handleOpenProgram = (program: YogaProgram) => {
    setSelectedProgram(program);
    onOpenProgram?.(program);
  };

  const handleDeleteProgram = async (programId: string) => {
    const shouldDelete = window.confirm("Удалить эту программу?");

    if (!shouldDelete) {
      return;
    }

    const relatedSchedules = await scheduleRepository.getByProgramId(programId);
    await Promise.all(
      relatedSchedules.map((schedule) =>
        scheduleRepository.delete(schedule.id),
      ),
    );
    await programRepository.delete(programId);

    setPrograms((currentPrograms) =>
      currentPrograms.filter((program) => program.id !== programId),
    );

    setSelectedProgram((currentProgram) =>
      currentProgram?.id === programId ? null : currentProgram,
    );
  };

  return (
    <PageLayout
      caption="Program Library"
      title="Сохраненные практики"
      description="Выберите программу для занятия или удалите то, что больше не нужно."
    >
      {sortedPrograms.length === 0 ? (
        <div className={styles.emptyState}>
          <Card
            caption="Пока пусто"
            title="Нет сохранённых программ"
            description="Сохранённые практики появятся здесь, когда вы добавите их в приложение."
          />
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.list} aria-label="Список сохранённых программ">
            {sortedPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onOpen={handleOpenProgram}
                onDelete={handleDeleteProgram}
              />
            ))}
          </div>

          {selectedProgram ? (
            <aside aria-labelledby="opened-program-title">
              <Card
                caption="Открытая программа"
                title={selectedProgram.name || "Без названия"}
              />

              <p className={styles.previewMeta}>
                {formatDuration(getProgramDuration(selectedProgram))}
              </p>

              <ol className={styles.phaseList}>
                {selectedProgram.phases.map((phase, index) => (
                  <li className={styles.phaseItem} key={phase.id}>
                    <span className={styles.phaseNumber}>{index + 1}</span>
                    <div>
                      <h3>{phase.name}</h3>
                      <p>{formatDuration(phase.durationSeconds)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </div>
      )}
    </PageLayout>
  );
}
