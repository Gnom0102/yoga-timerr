import type { EntityId, ISODateString } from '../../shared/types'

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ScheduleSettings {
  weekdays: Weekday[]
  time: string
  reminderEnabled: boolean
  reminderMinutesBefore?: number
}

export interface Schedule {
  id: EntityId
  programId: EntityId
  settings: ScheduleSettings
  enabled: boolean
  createdAt: ISODateString
  updatedAt: ISODateString
}

