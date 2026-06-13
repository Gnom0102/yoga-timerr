import { ProgressCircle } from "../../../features/timer";

interface TimerCircleProps {
  progress: number;
  percentProgress?: number;
  remainingSeconds: number;
  label: string;
}

export function TimerCircle({
  progress,
  percentProgress,
  remainingSeconds,
  label,
}: TimerCircleProps) {
  return (
    <ProgressCircle
      progress={progress}
      percentProgress={percentProgress}
      remainingSeconds={remainingSeconds}
      label={label}
    />
  );
}
