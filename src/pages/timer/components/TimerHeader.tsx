import styles from "../TimerScreen.module.css";
import { TimerTopControls } from "./TimerTopControls";

interface TimerHeaderProps {
  title: string;
  onBack?: () => void;
  onResetPhase: () => void;
  isResetPhaseDisabled: boolean;
  isMuted: boolean;
  onToggleMuted: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function TimerHeader({
  title,
  onBack,
  onResetPhase,
  isResetPhaseDisabled,
  isMuted,
  onToggleMuted,
  volume,
  onVolumeChange,
}: TimerHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerControls}>
        <TimerTopControls
          onBack={onBack}
          onResetPhase={onResetPhase}
          isResetPhaseDisabled={isResetPhaseDisabled}
          isMuted={isMuted}
          onToggleMuted={onToggleMuted}
          volume={volume}
          onVolumeChange={onVolumeChange}
        />
      </div>

      <div className={styles.headerCaption}>
        <p className={styles.caption}>Практика</p>
      </div>

      <div className={styles.headerTitle}>
        <h1 id="timer-title">{title}</h1>
      </div>
    </header>
  );
}
