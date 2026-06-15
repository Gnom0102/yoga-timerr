import type { ReactNode } from "react";

import styles from "../TimerScreen.module.css";
import { BotanicalDecor } from "./BotanicalDecor";
import { TimerSidebar } from "./TimerSidebar";

interface TimerPageLayoutProps {
  children: ReactNode;
  onOpenPrograms?: () => void;
  onOpenSchedule?: () => void;
}

export function TimerPageLayout({
  children,
  onOpenPrograms,
  onOpenSchedule,
}: TimerPageLayoutProps) {
  return (
    <main className={styles.page}>
      <TimerSidebar
        onOpenPrograms={onOpenPrograms}
        onOpenSchedule={onOpenSchedule}
      />

      <section className={styles.screen} aria-labelledby="timer-title">
        {children}
      </section>

      <BotanicalDecor />
    </main>
  );
}
