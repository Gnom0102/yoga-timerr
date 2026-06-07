import {
  getProgramDuration,
  type YogaProgram,
} from "../../../entities/program";
import { formatDate } from "../../../shared/utils/formatDate";
import { formatDuration } from "../../../shared/utils/formatDuration";

import styles from "./ProgramCard.module.css";

interface ProgramCardProps {
  program: YogaProgram;
  onOpen: (program: YogaProgram) => void;
  onDelete: (programId: string) => void;
}

export function ProgramCard({ program, onOpen, onDelete }: ProgramCardProps) {
  const totalDurationSeconds = getProgramDuration(program);
  const phaseCount = program.phases.length;

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <p className={styles.caption}>Практика</p>

        <h2 className={styles.title}>{program.name || "Без названия"}</h2>

        <div className={styles.meta}>
          <span>{formatDuration(totalDurationSeconds)}</span>
          <span>{phaseCount} этапов</span>
          <span>Обновлено {formatDate(program.updatedAt)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={() => onOpen(program)}
        >
          Открыть
        </button>

        <button
          className={styles.deleteButton}
          type="button"
          onClick={() => onDelete(program.id)}
        >
          Удалить
        </button>
      </div>
    </article>
  );
}
