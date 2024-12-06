'use client';

import useSWR from 'swr';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import AppointmentNewEditForm from '../appointment-new-edit-form';

// ----------------------------------------------------------------------

export default function AppointmentCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Use SWR to fetch data from multiple endpoints in parallel and pass them to invoice New Edit form
  const {
    data: service,
    isLoading: isserviceLoading,
    error: errorS,
  } = useSWR('/api/salonapp/services', fetcher);
  const {
    data: branches,
    isLoading: isbranchesLoading,
    error: errorB,
  } = useSWR('/api/salonapp/branches', fetcher);
  const {
    data: employees,
    isLoading: isEmployeeLoading,
    error: errorE,
  } = useSWR('/api/salonapp/employee', fetcher);
  const {
    data: appsettings,
    isLoading: isAppSettingsLoading,
    error: errorI,
  } = useSWR('/api/salonapp/settings', fetcher);

  if (isserviceLoading || isbranchesLoading || isEmployeeLoading || isAppSettingsLoading)
    return <div>Loading...</div>;
  if (errorS || errorB || errorE || errorI) return <div>Error Loading...</div>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.appointment.create_appointment')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.appointment.name'),
            href: paths.dashboard.appointments.root,
          },
          { name: t('salonapp.appointment.new_appointment') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AppointmentNewEditForm
        services={service.data}
        employees={employees.data}
        branches={branches.data}
      />
    </Container>
  );
}
