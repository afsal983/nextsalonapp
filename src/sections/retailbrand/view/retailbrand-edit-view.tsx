'use client';

import useSWR from 'swr';
import React from 'react';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RetailNewEditForm from '../retailbrand-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function RetailBrandEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: retailbrandData, error: retailbrandError } = useSWR(
    `/api/salonapp/retailbrand/${id}`,
    fetcher
  );

  if (retailbrandError) return <div>Failed to load</div>;
  if (!retailbrandData) return <div>Loading...</div>;

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
            href: paths.dashboard.retailbrands.root,
          },
          { name: retailbrandData?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RetailNewEditForm currentRetailbrand={retailbrandData?.data[0]} />
    </DashboardContent>
  );
}
