import { Card } from "../../../shared/ui";
import { formatDuration } from "../../../shared/utils/formatDuration";

import styles from "../TimerScreen.module.css";

interface NextStageCardProps {
  title: string;
  durationSeconds?: number;
  isDisabled?: boolean;
}

export function NextStageCard({
  title,
  durationSeconds,
  isDisabled = false,
}: NextStageCardProps) {
  const duration =
    durationSeconds === undefined ? undefined : formatDuration(durationSeconds);

  return (
    <Card
      as="section"
      className={styles.nextBlock}
      aria-disabled={isDisabled || undefined}
    >
      <p className={styles.nextBlockCaption}>Следующий этап</p>

      <div className={styles.nextBlockRow}>
        <h2 className={styles.nextBlockTitle}>{title}</h2>
        {duration ? (
          <p className={styles.nextBlockDuration}>{duration}</p>
        ) : null}
      </div>
    </Card>
  );
}
