import { Button } from "../../../shared/ui";
import styles from "../TimerScreen.module.css";

interface TimerTopControlsProps {
  onBack?: () => void;
  onResetPhase: () => void;
  isResetPhaseDisabled: boolean;
  isMuted: boolean;
  onToggleMuted: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function TimerTopControls({
  onBack,
  onResetPhase,
  isResetPhaseDisabled,
  isMuted,
  onToggleMuted,
  volume,
  onVolumeChange,
}: TimerTopControlsProps) {
  return (
    <>
      <Button
        className={styles.timerBackButton}
        variant="secondary"
        onClick={onBack}
      >
        Назад
      </Button>

      <Button
        className={styles.timerResetPhaseButton}
        variant="secondary"
        onClick={onResetPhase}
        disabled={isResetPhaseDisabled}
      >
        <ResetIcon />
        <span className={styles.resetPhaseText}>Сбросить этап</span>
      </Button>

      <Button
        aria-label={isMuted ? "Включить звук" : "Выключить звук"}
        aria-pressed={isMuted}
        className={styles.timerSoundButton}
        variant="ghost"
        onClick={onToggleMuted}
      >
        {isMuted ? <MutedIcon /> : <VolumeIcon />}
      </Button>

      <label className={styles.timerVolumeControl}>
        <span className={styles.timerVolumeLabel}>Громкость</span>
        <input
          aria-label="Громкость"
          className={styles.timerVolumeSlider}
          max="100"
          min="0"
          type="range"
          value={Math.round(volume * 100)}
          onChange={(event) =>
            onVolumeChange(Number(event.currentTarget.value) / 100)
          }
        />
      </label>
    </>
  );
}

function ResetIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <path
        d="M4 7v5h5M5.7 16A7 7 0 1 0 6 7.4L4 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      viewBox="0 0 24 24"
      width="22"
    >
      <path
        d="M4 14v-4h4l5-4v12l-5-4H4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      viewBox="0 0 24 24"
      width="22"
    >
      <path
        d="M4 14v-4h4l5-4v12l-5-4H4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m17 9 4 4m0-4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
