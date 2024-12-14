'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { ORDER_STATUS_OPTIONS } from 'src/_data';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';

import AppointmentDetailsInfo from '../appointment-details-info';
import AppointmentDetailsItems from '../appointment-details-item';
import AppointmentDetailsToolbar from '../appointment-details-toolbar';
import AppointmentDetailsHistory from '../appointment-details-history';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function AppointmentDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const [status, setStatus] = useState('pending');

  const { data: appointment, isLoading: appointmentLoading } = useSWR(
    `/api/salonapp/appointments/${id}`,
    fetcher
  );

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  if (appointmentLoading) return <div>Loading...</div>;

  return (
    <DashboardContent>
      <AppointmentDetailsToolbar
        backLink={paths.dashboard.appointments.root}
        orderNumber={appointment.id}
        createdAt={appointment.start}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <AppointmentDetailsItems
              items={appointment.items}
              taxes={appointment.taxes}
              shipping={appointment.shipping}
              discount={appointment.discount}
              subTotal={appointment.subTotal}
              totalAmount={appointment.totalAmount}
            />

            <AppointmentDetailsHistory history={appointment.history} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppointmentDetailsInfo
            customer={appointment.Customer}
            delivery={appointment.delivery}
            payment={appointment.payment}
            shippingAddress={appointment.shippingAddress}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
