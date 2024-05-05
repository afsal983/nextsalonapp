// ----------------------------------------------------------------------

export type ICalendarFilterValue = string[] | Date | null

export interface ICalendarFilters {
  colors: string[]
  startDate: Date | null
  endDate: Date | null
}

// ----------------------------------------------------------------------

export type ICalendarDate = string | number

export type ICalendarView =
  | 'dayGridMonth'
  | 'timeGridWeek'
  | 'timeGridDay'
  | 'listWeek'

export type ICalendarRange = {
  start: ICalendarDate
  end: ICalendarDate
} | null

export interface ICalendarEvent {
  id: string
  color: string
  title: string
  allDay: boolean
  description: string
  end: ICalendarDate
  start: ICalendarDate
}
