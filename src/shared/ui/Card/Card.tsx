import type { HTMLAttributes, ReactNode } from "react";

import styles from "./Card.module.css";

type CardVariant = "surface" | "outline" | "plain";
type CardPadding = "medium" | "large";
type CardElement = "article" | "section" | "div";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  variant?: CardVariant;
  padding?: CardPadding;
  caption?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export function Card({
  as: Component = "article",
  variant = "surface",
  padding = "medium",
  caption,
  title,
  description,
  actions,
  footer,
  children,
  className,
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    styles[variant],
    styles[padding],
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classNames} {...props}>
      {caption || title || description || actions ? (
        <header className={styles.header}>
          <div className={styles.heading}>
            {caption ? <p className={styles.caption}>{caption}</p> : null}
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>

          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
      ) : null}

      {children ? <div className={styles.content}>{children}</div> : null}

      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </Component>
  );
}
