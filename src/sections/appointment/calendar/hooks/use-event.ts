import { useMemo } from 'react';

import { merge } from 'src/utils/helper';

import { CALENDAR_COLOR_OPTIONS } from 'src/_data/_calendar';

import { ICalendarRange, ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

export default function useEvent(
  events: ICalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange,
  openForm: boolean,
  selectedEmployee: number
) {
  const currentEvent = events.find((event) => event.id === selectEventId);

  const defaultValues: ICalendarEvent = useMemo(
    () => ({
      id: '',
      title: '',
      notes: '',
      color: CALENDAR_COLOR_OPTIONS[1],
      allDay: false,
      customer_id: 0,
      Customer: null,
      employee_id: selectedEmployee || 0,
      service_id: 0,
      Product: null,
      start: selectedRange ? selectedRange.start : new Date().getTime(),
      end: selectedRange ? selectedRange.end : new Date().getTime(),
    }),
    [selectedRange, selectedEmployee]
  );

  if (!openForm) {
    return undefined;
  }

  if (currentEvent || selectedRange) {
    return merge({}, defaultValues, currentEvent);
  }

  return defaultValues;
}
