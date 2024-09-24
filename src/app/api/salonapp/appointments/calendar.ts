import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

import { ICalendarEvent } from 'src/types/calendar';
import { AppointmentItem} from 'src/types/appointment';

// ----------------------------------------------------------------------

const URL = endpoints.calendar;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

type Props = {
  employeeId: Number,
  startDate: Date| null,
  endDate: Date| null,
};

export function useGetEvents({ employeeId, startDate, endDate }: Props) {
  //const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  console.log(employeeId)


  console.log("CAL")
  // Get All invoices and services
  const { data: data,isLoading,  error, isValidating } = useSWR(`/api/salonapp/appointments/calendar?employeeId=${employeeId}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`, fetcher);

  console.log(data)
  const memoizedValue = useMemo(() => {
    /*
    const events = data?.data?.map((event: ICalendarEvent) => ({
      ...event,
      textColor: event.color,
    }));
    */
    const events = data?.data?.map((event: AppointmentItem) => ({
      id: String(event.id),
      color: "red",
      title: event.Product.name,
      allDay: false,
      description: event.Customer.firstname,
      employee_id: event.employee_id,
      service_id: event.product_id,
      end: event.start,
      start: event.end,
      textColor: "red",
    }));

    return {
      events: (events as ICalendarEvent[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.data?.length,
    };
  }, [data?.data, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  /**
   * Work on server
   */
  // const data = { eventData };
  // await axios.post(URL, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = [...currentData.events, eventData];

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  /**
   * Work on server
   */
  // const data = { eventData };
  // await axios.put(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.map((event: ICalendarEvent) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  /**
   * Work on server
   */
  // const data = { eventId };
  // await axios.patch(endpoints.calendar, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.filter(
        (event: ICalendarEvent) => event.id !== eventId
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}
