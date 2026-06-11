import type { HTMLAttributes, ReactNode } from "react";

import styles from "./Layout.module.css";

interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  caption?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

interface SectionLayoutProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageLayout({
  caption,
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageLayoutProps) {
  const classNames = [styles.page, className ?? ""].filter(Boolean).join(" ");

  return (
    <div className={classNames} {...props}>
      <main className={styles.container}>
        {caption || title || description || actions ? (
          <header className={styles.pageHeader}>
            <div className={styles.pageHeading}>
              {caption ? <p className={styles.caption}>{caption}</p> : null}
              {title ? <h1 className={styles.pageTitle}>{title}</h1> : null}
              {description ? (
                <p className={styles.description}>{description}</p>
              ) : null}
            </div>

            {actions ? <div className={styles.actions}>{actions}</div> : null}
          </header>
        ) : null}

        {children}
      </main>
    </div>
  );
}

export function SectionLayout({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: SectionLayoutProps) {
  const classNames = [styles.section, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classNames} {...props}>
      {title || description || actions ? (
        <header className={styles.sectionHeader}>
          <div>
            {title ? <h2 className={styles.sectionTitle}>{title}</h2> : null}
            {description ? (
              <p className={styles.sectionDescription}>{description}</p>
            ) : null}
          </div>

          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
      ) : null}

      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}
