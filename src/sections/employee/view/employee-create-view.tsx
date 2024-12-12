'use client';

import useSWR from 'swr';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import EmployeeNewEditForm from '../employee-new-edit-form';

// ----------------------------------------------------------------------

export default function EmployeeCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: branches, isLoading: isbranchesLoading } = useSWR(
    '/api/salonapp/branches',
    fetcher
  );
  const { data: users, isLoading: isusersLoading } = useSWR('/api/salonapp/user', fetcher);
  const { data: service, isLoading: isserviceLoading } = useSWR('/api/salonapp/services', fetcher);

  // Wait for data loading
  if (isbranchesLoading || isusersLoading || isserviceLoading) return <div>Loading...</div>;
  if (!branches || !users || !service) return <div>Loading...</div>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.employee.new_employee')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.employee.employee'),
            href: paths.dashboard.employees.root,
          },
          { name: t('salonapp.employee.new_employee') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EmployeeNewEditForm branches={branches.data} users={users.data} services={service.data} />
    </DashboardContent>
  );
}
