'use client';

import useSWR from 'swr';
import React from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import EmployeeNewEditForm from '../employee-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function EmployeeEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: employeeData, isLoading: isemployeeDataLoading } = useSWR(
    `/api/salonapp/employee/${id}`,
    fetcher
  );
  const { data: branches, isLoading: isbranchesLoading } = useSWR(
    '/api/salonapp/branches',
    fetcher
  );
  const { data: users, isLoading: isusersLoading } = useSWR('/api/salonapp/user', fetcher);
  const { data: service, isLoading: isserviceLoading } = useSWR('/api/salonapp/services', fetcher);

  if (isemployeeDataLoading || isbranchesLoading || isusersLoading || isserviceLoading)
    return <div>Loading</div>;
  if (!employeeData || !users || !branches || !service) return <div>Loading...</div>;

  if (employeeData) {
    console.log(employeeData);
  }
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.employees'),
            href: paths.dashboard.employees.root,
          },
          { name: employeeData?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EmployeeNewEditForm
        currentEmployee={employeeData?.data[0]}
        branches={branches.data}
        users={users.data}
        services={service.data}
      />
    </DashboardContent>
  );
}
