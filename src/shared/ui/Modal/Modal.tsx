import { useEffect, type ReactNode } from "react";
import { Button } from "../Button";

import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  onClose: () => void;
}

export function Modal({
  isOpen,
  title,
  description,
  children,
  footer,
  closeLabel = "Закрыть",
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.caption}>Йога таймер</p>
            <h2 className={styles.title} id="modal-title">
              {title}
            </h2>

            {description ? (
              <p className={styles.description} id="modal-description">
                {description}
              </p>
            ) : null}
          </div>

          <Button variant="icon" aria-label={closeLabel} onClick={onClose}>
            {" "}
            X{" "}
          </Button>
        </header>

        {children ? <div className={styles.content}>{children}</div> : null}

        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>
  );
}
