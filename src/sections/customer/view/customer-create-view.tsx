'use client';

import useSWR from 'swr';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CustomerNewEditForm from '../customer-new-edit-form';

// ----------------------------------------------------------------------

export default function CustomerCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: customercategory, isLoading: iscustomercategoryLoading } = useSWR(
    '/api/salonapp/customercategory',
    fetcher
  );

  // Wait for data loading
  if (iscustomercategoryLoading) return <div>Loading...</div>;
  if (!customercategory) return <div>Loading...</div>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.customer.create_customer')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.customer.name'),
            href: paths.dashboard.services.root,
          },
          { name: t('salonapp.customer.new_customer') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomerNewEditForm customercategory={customercategory.data} />
    </DashboardContent>
  );
}
