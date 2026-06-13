import { Button } from "../../../shared/ui";

import styles from "../TimerScreen.module.css";

interface TimerControlsProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  showReset: boolean;
  onReset: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

export function TimerControls({
  primaryLabel,
  onPrimaryClick,
  showReset,
  onReset,
  onNext,
  isNextDisabled,
}: TimerControlsProps) {
  return (
    <div className={styles.controls}>
      <Button
        variant="secondary"
        size="large"
        onClick={onReset}
        disabled={!showReset}
      >
        Сброс
      </Button>

      <Button size="large" fullWidth onClick={onPrimaryClick}>
        {primaryLabel}
      </Button>

      <Button
        variant="icon"
        size="large"
        onClick={onNext}
        disabled={isNextDisabled}
        aria-label="Следующий этап"
        title="Следующий этап"
      >
        <ArrowRightIcon />
      </Button>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
