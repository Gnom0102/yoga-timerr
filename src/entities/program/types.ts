import type {
  DurationSeconds,
  EntityId,
  ISODateString,
} from "../../shared/types";

export type PhaseType =
  | "warmup"
  | "asana"
  | "pranayama"
  | "relaxation"
  | "meditation"
  | "shavasana";

export interface YogaPhase {
  id: EntityId;
  name: string;
  type: PhaseType;
  durationSeconds: DurationSeconds;
}

export interface YogaProgram {
  id: EntityId;
  name: string;
  phases: YogaPhase[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
