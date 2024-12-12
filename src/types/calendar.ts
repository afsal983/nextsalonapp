// ----------------------------------------------------------------------
import { Customer } from 'src/types/customer';
import { ServiceItem } from 'src/types/service';

import type { IDatePickerControl } from './common';

export type ICalendarFilterValue = string[] | Date | null;

export interface ICalendarFilters {
  colors: string[];
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
}

// ----------------------------------------------------------------------

export type ICalendarDate = string | number;

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarRange = {
  start: ICalendarDate;
  end: ICalendarDate;
} | null;

export interface ICalendarEvent {
  id: string;
  color: string;
  notes: string;
  allDay: boolean;
  customer_id: number;
  Customer: Customer | null;
  employee_id: number;
  service_id: number;
  Product: ServiceItem | null;
  end: ICalendarDate;
  start: ICalendarDate;
}
