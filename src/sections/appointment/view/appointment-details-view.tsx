'use client';

import { useState, useCallback } from 'react';
import useSWR,{mutate} from 'swr';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { fetcher } from 'src/utils/axios';
import { paths } from 'src/routes/paths';

import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

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

  const currentOrder = _orders.filter((appointment) => appointment.id === id)[0];

  const [status, setStatus] = useState("pending");

  const { data: appointment,isLoading: appointmentLoading, error: errorA } = useSWR(`/api/salonapp/appointments/${id}`, fetcher);

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  if ( appointmentLoading) return <div>Loading...</div>;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <AppointmentDetailsToolbar
        backLink={paths.dashboard.appointments.root}
        orderNumber={appointment.id}
        createdAt={appointment.start}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
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

        <Grid xs={12} md={4}>
          <AppointmentDetailsInfo
            customer={appointment.Customer}
            delivery={appointment.delivery}
            payment={appointment.payment}
            shippingAddress={appointment.shippingAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
