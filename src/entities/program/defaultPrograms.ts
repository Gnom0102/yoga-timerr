import type { YogaProgram } from "./types";

export const defaultPrograms: YogaProgram[] = [
  {
    id: "default-morning-soft-practice",
    name: "Утренняя мягкая практика",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    phases: [
      {
        id: "default-morning-setup",
        name: "Настройка на практику",
        type: "meditation",
        durationSeconds: 120,
      },
      {
        id: "default-morning-breath",
        name: "Спокойное дыхание",
        type: "pranayama",
        durationSeconds: 180,
      },
      {
        id: "default-morning-warmup",
        name: "Мягкая разминка суставов",
        type: "warmup",
        durationSeconds: 180,
      },
      {
        id: "default-morning-cat-cow",
        name: "Кошка-корова",
        type: "asana",
        durationSeconds: 120,
      },
      {
        id: "default-morning-dog-lunge",
        name: "Собака мордой вниз и мягкий выпад",
        type: "asana",
        durationSeconds: 180,
      },
      {
        id: "default-morning-forward-fold",
        name: "Наклон вперед",
        type: "asana",
        durationSeconds: 60,
      },
      {
        id: "default-morning-shavasana",
        name: "Короткая шавасана",
        type: "shavasana",
        durationSeconds: 60,
      },
    ],
  },
  {
    id: "default-back-practice",
    name: "Практика для спины",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    phases: [
      {
        id: "default-back-setup",
        name: "Настройка и наблюдение дыхания",
        type: "meditation",
        durationSeconds: 60,
      },
      {
        id: "default-back-spine-mobility",
        name: "Мобилизация позвоночника",
        type: "warmup",
        durationSeconds: 180,
      },
      {
        id: "default-back-cat-cow",
        name: "Кошка-корова",
        type: "asana",
        durationSeconds: 120,
      },
      {
        id: "default-back-child-pose",
        name: "Поза ребенка",
        type: "relaxation",
        durationSeconds: 90,
      },
      {
        id: "default-back-soft-twists",
        name: "Мягкие скрутки лежа",
        type: "asana",
        durationSeconds: 150,
      },
      {
        id: "default-back-compensation",
        name: "Компенсация: колени к груди",
        type: "relaxation",
        durationSeconds: 60,
      },
      {
        id: "default-back-relaxation",
        name: "Расслабление спины",
        type: "shavasana",
        durationSeconds: 60,
      },
    ],
  },
  {
    id: "default-evening-relaxation",
    name: "Вечернее расслабление",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    phases: [
      {
        id: "default-evening-breath",
        name: "Дыхание с удлиненным выдохом",
        type: "pranayama",
        durationSeconds: 240,
      },
      {
        id: "default-evening-neck-shoulders",
        name: "Мягкое расслабление шеи и плеч",
        type: "warmup",
        durationSeconds: 180,
      },
      {
        id: "default-evening-forward-fold",
        name: "Мягкое вытяжение вперед",
        type: "asana",
        durationSeconds: 180,
      },
      {
        id: "default-evening-child-pose",
        name: "Поза ребенка",
        type: "relaxation",
        durationSeconds: 180,
      },
      {
        id: "default-evening-twist",
        name: "Скрутка лежа",
        type: "asana",
        durationSeconds: 180,
      },
      {
        id: "default-evening-legs-wall",
        name: "Ноги на опоре",
        type: "relaxation",
        durationSeconds: 180,
      },
      {
        id: "default-evening-shavasana",
        name: "Длинная шавасана",
        type: "shavasana",
        durationSeconds: 360,
      },
    ],
  },
];
