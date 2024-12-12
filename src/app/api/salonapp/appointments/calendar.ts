import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { merge } from 'src/utils/helper';
import { fetcher } from 'src/utils/axios';

import { ICalendarEvent } from 'src/types/calendar';
import { AppointmentItem } from 'src/types/appointment';
import type { IDatePickerControl } from 'src/types/common';
// ----------------------------------------------------------------------

let URL: string;

type Props = {
  employeeId: Number;
  startDate: IDatePickerControl | null;
  endDate: IDatePickerControl | null;
};

export function useGetEvents({ employeeId, startDate, endDate }: Props) {
  // const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  URL = `/api/salonapp/appointments/calendar?employeeId=${employeeId}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`;
  // Get All invoices and services
  const { data, isLoading, error, isValidating } = useSWR(
    `/api/salonapp/appointments/calendar?employeeId=${employeeId}&startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 500, // Set to 500ms to revalidate more frequently
    }
  );

  const memoizedValue = useMemo(() => {
    /*
    const events = data?.data?.map((event: ICalendarEvent) => ({
      ...event,
      textColor: event.color,
    }));
    */
    const events = data?.data?.map((event: AppointmentItem) => ({
      id: String(event.id),
      color: 'red',
      title: `${event?.Customer?.firstname} ${event?.Customer?.lastname}`,
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
      textColor: 'red',
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
  // Convert the ICalendarEvent to Actual Event supported in the server
  const newevent = {
    id: 0,
    start: new Date(eventData?.start).toISOString(),
    end: new Date(eventData?.end).toISOString(),
    customer_id: eventData.customer_id,
    product_id: eventData?.service_id,
    employee_id: eventData?.employee_id,
    branch_id: 1,
    reminder_count: 0,
    notes: eventData.notes,
    deleted: 0,
    Additional_products: [],
  };

  // Post the data to remote server
  const response = await fetch(`/api/salonapp/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newevent),
  });

  // Get the response
  const responseData = await response.json();

  if (responseData?.status !== 200) {
    return responseData;
  }

  const updatedevent = merge({}, newevent, {
    id: responseData?.data[0].id,
    Customer: eventData?.Customer,
    Product: eventData?.Product,
  });

  // Access and log the cache for a specific key for better user experience
  mutate(
    URL,
    (currentData: any) => {
      const data = [...currentData.data, updatedevent];

      return {
        ...currentData,
        data,
      };
    },
    false
  );

  return responseData;
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  // Convert the ICalendarEvent to Actual Event supported in the server
  const newevent = {
    id: Number(eventData?.id),
    start: new Date(eventData?.start || '').toISOString(),
    end: new Date(eventData?.end || '').toISOString(),
    customer_id: eventData.customer_id,
    product_id: eventData?.service_id,
    employee_id: eventData?.employee_id,
    branch_id: 1,
    reminder_count: 0,
    notes: eventData.notes,
    deleted: 0,
    Additional_products: [],
  };

  // Post the data to remote server
  const response = await fetch(`/api/salonapp/appointments`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newevent),
  });

  // Get the response
  const responseData = await response.json();
  if (responseData?.status !== 200) {
    return responseData;
  }

  mutate(
    URL,
    (currentData: any) => {
      const data: ICalendarEvent[] = currentData?.data?.map((event: AppointmentItem) =>
        Number(event.id) === Number(eventData.id) ? { ...event, ...newevent } : event
      );

      return {
        ...currentData.data,
        data,
      };
    },
    false
  );

  return responseData;
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  // Post the data to remote server
  const response = await fetch(`/api/salonapp/appointments/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Get the response
  const responseData = await response.json();
  if (responseData?.status !== 200) {
    return responseData;
  }

  mutate(
    URL,
    (currentData: any) => {
      const data: ICalendarEvent[] = currentData?.data.filter(
        (event: AppointmentItem) => Number(event.id) !== Number(eventId)
      );

      return {
        ...currentData.data,
        data,
      };
    },
    false
  );
  return responseData;
}
