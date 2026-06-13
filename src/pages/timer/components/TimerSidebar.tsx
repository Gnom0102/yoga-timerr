import styles from "../TimerScreen.module.css";

export function TimerSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Навигация">
      <div className={styles.brand}>
        <LotusIcon />
        <span>Yoga Timer</span>
      </div>

      <nav className={styles.sidebarNav}>
        <a className={styles.sidebarNavItemActive} href="#">
          <LeafIcon />
          <span>Практики</span>
        </a>

        <a className={styles.sidebarNavItem} href="#">
          <CalendarIcon />
          <span>Расписание</span>
        </a>
      </nav>

      <section className={styles.todayCard} aria-label="Практики на сегодня">
        <div className={styles.todayHeader}>
          <span>Сегодня</span>
          <span>2 практики</span>
        </div>

        <div className={styles.todayRow}>
          <span>Утренняя практика</span>
          <span>20 мин</span>
        </div>

        <div className={styles.todayRow}>
          <span>Вечернее расслабление</span>
          <span>30 мин</span>
        </div>

        <button className={styles.newPracticeButton} type="button">
          <span aria-hidden="true">+</span>
          <span>Новая практика</span>
        </button>
      </section>
    </aside>
  );
}

function LotusIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.brandIcon}
      fill="none"
      viewBox="0 0 64 48"
    >
      <path
        d="M32 42C20 32 20 17 32 5c12 12 12 27 0 37Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M31 42C17 39 8 29 8 14c14 3 23 13 23 28Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M33 42c14-3 23-13 23-28-14 3-23 13-23 28Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M32 42C21 45 11 42 3 34c11-3 21 0 29 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M32 42c11 3 21 0 29-8-11-3-21 0-29 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M20 4C10 4 5 9 5 19c10 0 15-5 15-15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M5 19 15 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M7 3v4M17 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
