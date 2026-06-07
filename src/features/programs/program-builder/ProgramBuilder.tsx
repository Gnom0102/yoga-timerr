import { useMemo, useState } from "react";

import type {
  YogaPhase,
  PhaseType,
  YogaProgram,
} from "../../../entities/program";

import {
  DEFAULT_PHASE_DURATION_SECONDS,
  MAX_PHASE_DURATION_SECONDS,
  MAX_PHASE_NAME_LENGTH,
  MAX_PROGRAM_NAME_LENGTH,
  MIN_PHASE_DURATION_SECONDS,
} from "../../../shared/constants";

import styles from "./ProgramBuilder.module.css";

const PHASE_TYPE_OPTIONS: Array<{ value: PhaseType; label: string }> = [
  { value: "warmup", label: "Разминка" },
  { value: "asana", label: "Асаны" },
  { value: "pranayama", label: "Пранаяма" },
  { value: "relaxation", label: "Расслабление" },
  { value: "meditation", label: "Медитация" },
  { value: "shavasana", label: "Шавасана" },
];

const DEFAULT_PHASE_NAME = "Новый этап";

interface PhaseDraft {
  name: string;
  type: PhaseType;
  durationMinutes: string; // string, а не number, чтобы сохранять промежуточные значения при вводе (например, "12.5" или пустую строку)
}

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // Fallback для старых браузеров или Node.js без crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const secondsToMinutes = (seconds: number) => String(seconds / 60);
const minutesToSeconds = (minutes: string) => Math.round(Number(minutes) * 60);

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} мин`;
  }

  return `${minutes} мин ${remainingSeconds} сек`;
};

const getPhaseTypeLabel = (type: PhaseType) => {
  return (
    PHASE_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type
  );
};

const createEmptyDraft = (): PhaseDraft => ({
  name: "",
  type: "asana",
  durationMinutes: secondsToMinutes(DEFAULT_PHASE_DURATION_SECONDS),
});

export function ProgramBuilder() {
  const [programName, setProgramName] = useState("Утренняя практика");
  const [phases, setPhases] = useState<YogaPhase[]>([]);
  const [phaseDraft, setPhaseDraft] = useState<PhaseDraft>(createEmptyDraft);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

  const totalDurationSeconds = useMemo(() => {
    return phases.reduce((total, phase) => total + phase.durationSeconds, 0);
  }, [phases]);

  // Виртуальный объект программы для предпросмотра, не сохраняется на сервер
  const programPreview: YogaProgram = useMemo(() => {
    const now = new Date().toISOString();

    return {
      id: "local-preview", // Статический ID, так как это только для отображения
      name: programName.trim(),
      phases,
      createdAt: now,
      updatedAt: now,
    };
  }, [programName, phases]);

  const programNameError =
    programName.trim().length === 0
      ? "Введите название программы."
      : programName.trim().length > MAX_PROGRAM_NAME_LENGTH
        ? `Название не должно быть длиннее ${MAX_PROGRAM_NAME_LENGTH} символов.`
        : "";

  const phaseNameError =
    phaseDraft.name.trim().length > MAX_PHASE_NAME_LENGTH
      ? `Название этапа не должно быть длиннее ${MAX_PHASE_NAME_LENGTH} символов.`
      : "";

  const phaseDurationSeconds = minutesToSeconds(phaseDraft.durationMinutes);

  const phaseDurationError =
    Number.isNaN(phaseDurationSeconds) || phaseDurationSeconds <= 0
      ? "Укажите длительность этапа."
      : phaseDurationSeconds < MIN_PHASE_DURATION_SECONDS
        ? `Минимальная длительность: ${formatDuration(MIN_PHASE_DURATION_SECONDS)}.`
        : phaseDurationSeconds > MAX_PHASE_DURATION_SECONDS
          ? `Максимальная длительность: ${formatDuration(MAX_PHASE_DURATION_SECONDS)}.`
          : "";

  const canSavePhase = !phaseNameError && !phaseDurationError;

  const handlePhaseSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSavePhase) {
      return;
    }

    const nextPhase: YogaPhase = {
      id: editingPhaseId ?? createId(), // При редактировании сохраняем старый ID
      name: phaseDraft.name.trim() || DEFAULT_PHASE_NAME, // Пустое имя заменяется на дефолтное
      type: phaseDraft.type,
      durationSeconds: phaseDurationSeconds,
    };

    setPhases((currentPhases) => {
      if (!editingPhaseId) {
        return [...currentPhases, nextPhase]; // Добавление
      }
      // Редактирование: заменяем этап с matching ID
      return currentPhases.map((phase) =>
        phase.id === editingPhaseId ? nextPhase : phase,
      );
    });

    // Сброс формы после сохранения
    setPhaseDraft(createEmptyDraft());
    setEditingPhaseId(null);
  };

  const handleEditPhase = (phase: YogaPhase) => {
    setEditingPhaseId(phase.id);
    setPhaseDraft({
      name: phase.name,
      type: phase.type,
      durationMinutes: secondsToMinutes(phase.durationSeconds),
    });
  };

  const handleDeletePhase = (phaseId: string) => {
    setPhases((currentPhases) =>
      currentPhases.filter((phase) => phase.id !== phaseId),
    );

    // Если удаляем этап, который сейчас редактируем, нужно сбросить форму
    if (editingPhaseId === phaseId) {
      setEditingPhaseId(null);
      setPhaseDraft(createEmptyDraft());
    }
  };

  const handleCancelEdit = () => {
    setEditingPhaseId(null);
    setPhaseDraft(createEmptyDraft());
  };

  return (
    <main className={styles.page}>
      <section
        className={styles.builder}
        aria-labelledby="program-builder-title"
      >
        <div className={styles.header}>
          <p className={styles.caption}>Program Builder</p>
          <h1 id="program-builder-title">Конструктор практики</h1>
          <p className={styles.description}>
            Соберите спокойную последовательность этапов для занятия
            хатха-йогой.
          </p>
        </div>

        <div className={styles.programNameField}>
          <label htmlFor="program-name">Название программы</label>
          <input
            id="program-name"
            maxLength={MAX_PROGRAM_NAME_LENGTH}
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            placeholder="Например, Мягкая вечерняя практика"
          />
          {programNameError ? (
            <span className={styles.error}>{programNameError}</span>
          ) : null}
        </div>

        <div className={styles.content}>
          <form className={styles.phaseForm} onSubmit={handlePhaseSubmit}>
            <div className={styles.formHeader}>
              <h2>{editingPhaseId ? "Редактировать этап" : "Добавить этап"}</h2>
              {editingPhaseId ? (
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Отменить
                </button>
              ) : null}
            </div>

            <label htmlFor="phase-name">Название этапа</label>
            <input
              id="phase-name"
              maxLength={MAX_PHASE_NAME_LENGTH}
              value={phaseDraft.name}
              onChange={(e) =>
                setPhaseDraft((draft) => ({ ...draft, name: e.target.value }))
              }
              placeholder="Напрмер, Сурья Намаскар (Приветствие солнцу)"
            />

            <label htmlFor="phase-type">Тип этапа</label>
            <select
              id="phase-type"
              value={phaseDraft.type}
              onChange={(e) =>
                setPhaseDraft((draft) => ({
                  ...draft,
                  type: e.target.value as PhaseType,
                }))
              }
            >
              {PHASE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="phase-duration">Длительность, минут</label>
            <input
              id="phase-duration"
              min={MIN_PHASE_DURATION_SECONDS / 60}
              max={MAX_PHASE_DURATION_SECONDS / 60}
              step="0.5"
              type="number"
              value={phaseDraft.durationMinutes}
              onChange={(event) =>
                setPhaseDraft((draft) => ({
                  ...draft,
                  durationMinutes: event.target.value,
                }))
              }
            />

            {phaseNameError ? (
              <span className={styles.error}>{phaseNameError}</span>
            ) : null}
            {phaseDurationError ? (
              <span className={styles.error}>{phaseDurationError}</span>
            ) : null}

            <button
              className={styles.primaryButton}
              type="submit"
              disabled={!canSavePhase}
            >
              {editingPhaseId ? "Сохранить этап" : "Добавить этап"}
            </button>
          </form>

          <section
            className={styles.phaseList}
            aria-labelledby="phase-list-title"
          >
            <div className={styles.summary}>
              <div>
                <p className={styles.caption}>Программа</p>
                <h2 id="phase-list-title">
                  {programPreview.name || "Без названия"}
                </h2>
              </div>
              <p>{formatDuration(totalDurationSeconds)}</p>
            </div>

            {phases.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Этапов пока нет</h3>
                <p>Добавьте первый этап, чтобы начать собирать практику.</p>
              </div>
            ) : (
              <ol className={styles.phases}>
                {phases.map((phase, index) => (
                  <li className={styles.phaseCard} key={phase.id}>
                    {/* index + 1 для отображения порядкового номера, т.к. порядок этапов важен для практики */}
                    <div className={styles.phaseNumber}>{index + 1}</div>

                    <div className={styles.phaseInfo}>
                      <h3>{phase.name}</h3>
                      <p>
                        {getPhaseTypeLabel(phase.type)}
                        {formatDuration(phase.durationSeconds)}
                      </p>
                    </div>

                    <div className={styles.phaseActions}>
                      <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => handleEditPhase(phase)}
                      >
                        Изменить
                      </button>
                      <button
                        className={styles.dangerButton}
                        type="button"
                        onClick={() => handleDeletePhase(phase.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
