import type { ReactNode } from "react";

import styles from "../TimerScreen.module.css";
import { TimerSidebar } from "./TimerSidebar";
import { BotanicalDecor } from "./BotanicalDecor";


interface TimerPageLayoutProps {
  children: ReactNode;
}

export function TimerPageLayout({ children }: TimerPageLayoutProps) {
  return (
    <main className={styles.page}>
      <TimerSidebar />

      <section className={styles.screen} aria-labelledby="timer-title">
        {children}
      </section>

      <BotanicalDecor />
    </main>
  );
}
