import {
  getProgramDuration,
  type YogaProgram,
} from "../../../entities/program";
import { Button, Card } from "../../../shared/ui";
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
    <Card
      caption="Практика"
      title={program.name || "Без названия"}
      actions={
        <>
          <Button onClick={() => onOpen(program)}>Открыть</Button>
          <Button variant="secondary" onClick={() => onDelete(program.id)}>
            Удалить
          </Button>
        </>
      }
    >
      <div className={styles.meta}>
        <span>{formatDuration(totalDurationSeconds)}</span>
        <span>{phaseCount} этапов</span>
        <span>Обновлено {formatDate(program.updatedAt)}</span>
      </div>
    </Card>
  );
}
