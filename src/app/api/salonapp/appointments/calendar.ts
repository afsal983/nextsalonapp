import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

import { ICalendarEvent } from 'src/types/calendar';
import { AppointmentItem} from 'src/types/appointment';

import { useSnackbar } from 'src/components/snackbar'
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


  // Get All invoices and services
  const { data: data,isLoading,  error, isValidating } = useSWR(`/api/salonapp/appointments/calendar?employeeId=${employeeId}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    dedupingInterval: 500, // Set to 500ms to revalidate more frequently
  });


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
      title: event?.Product?.name,
      allDay: false,
      description: event?.Customer?.firstname,
      customer_id: event?.customer_id,
      Customer: event?.Customer,
      employee_id: event?.employee_id,
      service_id: event?.product_id,
      Product: event?.Product,
      start: event.start,
      end: event.end,
      notes: event?.notes,
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

export async function createEvent(eventData: ICalendarEvent, appFilters) {
  /**
   * Work on server
   */

  // Convert the ICalendarEvent to Actual Event
  let  newevent = {
    id: 0,
    start: new Date(eventData?.start).toISOString(),
    end: new Date(eventData?.end).toISOString(),
    customer_id:eventData.customer_id ,
    Customer: undefined,
    product_id: eventData?.service_id,
    Product: undefined,
    employee_id: eventData?.employee_id,
    branch_id: 1,
    reminder_count: 0,
    notes: eventData.notes,
    deleted: 0,
    Additional_products: [],
  }

    // Post the data to remote server
    const response = await fetch(`/api/salonapp/appointments`, {
      method:  "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newevent),
    });

    const responseData = await response.json();

    newevent.id = responseData?.data[0].id
    newevent.Customer = eventData.Customer
    newevent.Product = eventData.Product

  /**
   * Work in local
   */
  // Access and log the cache for a specific key

  mutate(
    `/api/salonapp/appointments/calendar?employeeId=${eventData?.employee_id}&startDate=${appFilters.startDate?.toISOString()}&endDate=${appFilters.endDate?.toISOString()}`,
    (currentData: any) => {
      const data = [...currentData.data, newevent];

      return {
        ...currentData,
        data,
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
