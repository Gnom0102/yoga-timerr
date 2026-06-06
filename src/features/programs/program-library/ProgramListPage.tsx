import { useEffect, useMemo, useState } from "react";

import { formatDuration } from "../../../shared/utils/formatDuration";
import { programRepository } from "../../../shared/repositories";
import { ProgramCard } from "./ProgramCard";
import {
  getProgramDuration,
  type YogaProgram,
} from "../../../entities/program";

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

    await programRepository.delete(programId);

    setPrograms((currentPrograms) =>
      currentPrograms.filter((program) => program.id !== programId),
    );

    setSelectedProgram((currentProgram) =>
      currentProgram?.id === programId ? null : currentProgram,
    );
  };

  return (
    <main className={styles.page}>
      <section
        className={styles.library}
        aria-labelledby="program-library-title"
      >
        <header className={styles.header}>
          <p className={styles.caption}>Program Library</p>
          <h1 id="program-library-title">Сохранённые практики</h1>
          <p className={styles.description}>
            Выберите программу для занятия или удалите то, что больше не нужно.
          </p>
        </header>

        {sortedPrograms.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.caption}>Пока пусто</p>
            <h2>Нет сохранённых программ</h2>
            <p>
              Создайте первую практику в конструкторе, и она появится в этом
              списке.
            </p>
          </div>
        ) : (
          <div className={styles.content}>
            <div
              className={styles.list}
              aria-label="Список сохранённых программ"
            >
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
              <aside
                className={styles.preview}
                aria-labelledby="opened-program-title"
              >
                <p className={styles.caption}>Открытая программа</p>
                <h2 id="opened-program-title">
                  {selectedProgram.name || "Без названия"}
                </h2>

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
      </section>
    </main>
  );
}
