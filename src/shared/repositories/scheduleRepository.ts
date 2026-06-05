import type { Schedule } from '../../entities/schedule'
import type { EntityId } from '../types'

export interface ScheduleRepository {
  getAll(): Promise<Schedule[]>
  getById(id: EntityId): Promise<Schedule | null>
  getByProgramId(programId: EntityId): Promise<Schedule[]>
  save(schedule: Schedule): Promise<void>
  update(schedule: Schedule): Promise<void>
  delete(id: EntityId): Promise<void>
}

