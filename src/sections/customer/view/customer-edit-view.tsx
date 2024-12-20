'use client';

import useSWR from 'swr';
import React from 'react';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CustomerNewEditForm from '../customer-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function CustomerEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: customerData, error: customerError } = useSWR(
    `/api/salonapp/customer/${id}`,
    fetcher
  );
  const { data: customercategoryData } = useSWR(`/api/salonapp/customercategory`, fetcher);

  if (customerError || customerError) return <div>Failed to load</div>;
  if (!customerData || !customercategoryData) return <div>Loading...</div>;

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
            name: t('salonapp.customer.name'),
            href: paths.dashboard.customers.root,
          },
          { name: customerData?.data[0].firstname },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomerNewEditForm
        customercategory={customercategoryData.data}
        currentCustomer={customerData.data[0]}
      />
    </DashboardContent>
  );
}
