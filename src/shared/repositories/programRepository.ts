import type { EntityId } from "../types";
import { defaultPrograms, type YogaProgram } from "../../entities/program";
import { STORAGE_KEYS } from "../constants/storageKeys";

export interface ProgramRepository {
  getAll(): Promise<YogaProgram[]>;
  getById(id: EntityId): Promise<YogaProgram | null>;
  save(program: YogaProgram): Promise<void>;
  update(program: YogaProgram): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isYogaProgram = (value: unknown): value is YogaProgram => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    Array.isArray(value.phases) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
};

const writePrograms = (programs: YogaProgram[]) => {
  localStorage.setItem(STORAGE_KEYS.programs, JSON.stringify(programs));
};

const seedDefaultProgramsIfNeeded = () => {
  const rawPrograms = localStorage.getItem(STORAGE_KEYS.programs);

  if (rawPrograms !== null) {
    return;
  }

  writePrograms(defaultPrograms);
};

const readPrograms = (): YogaProgram[] => {
  seedDefaultProgramsIfNeeded();

  const rawPrograms = localStorage.getItem(STORAGE_KEYS.programs);

  if (!rawPrograms) {
    return [];
  }

  try {
    const parsedPrograms: unknown = JSON.parse(rawPrograms);

    if (!Array.isArray(parsedPrograms)) {
      return [];
    }

    return parsedPrograms.filter(isYogaProgram);
  } catch {
    return [];
  }
};

export const programRepository: ProgramRepository = {
  async getAll() {
    return readPrograms();
  },

  async getById(id) {
    return readPrograms().find((program) => program.id === id) ?? null;
  },

  async save(program) {
    const programs = readPrograms();
    const programIndex = programs.findIndex((item) => item.id === program.id);

    if (programIndex >= 0) {
      programs[programIndex] = program;
      writePrograms(programs);
      return;
    }

    writePrograms([...programs, program]);
  },

  async update(program) {
    const programs = readPrograms();
    const nextPrograms = programs.map((item) =>
      item.id === program.id ? program : item,
    );

    writePrograms(nextPrograms);
  },

  async delete(id) {
    writePrograms(readPrograms().filter((program) => program.id !== id));
  },
};
