// ----------------------------------------------------------------------
import { Customer } from 'src/types/customer';
import { ServiceItem } from 'src/types/service';
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
  notes: string
  allDay: boolean
  customer_id: number
  Customer: Customer | undefined
  employee_id: number
  service_id: number
  Product:ServiceItem | undefined
  end: ICalendarDate
  start: ICalendarDate
}
