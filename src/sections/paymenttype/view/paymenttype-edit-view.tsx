'use client';

import useSWR from 'swr';
import React from 'react';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PaymentTypeNewEditForm from '../paymenttype-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function PaymenttypeEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: paymenttypeData, error: paymenttypeError } = useSWR(
    `/api/salonapp/paymenttype/${id}`,
    fetcher
  );

  if (paymenttypeError) return <div>Failed to load</div>;
  if (!paymenttypeData) return <div>Loading...</div>;

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
            name: t('salonapp.retails'),
            href: paths.dashboard.invoice.paymenttypes.root,
          },
          { name: paymenttypeData?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PaymentTypeNewEditForm currentPaymentType={paymenttypeData?.data[0]} />
    </DashboardContent>
  );
}
