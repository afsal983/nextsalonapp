'use client';

import useSWR from 'swr';
import React from 'react';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LocationNewEditForm from '../location-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function BranchEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const {
    data: location,
    isLoading: islocationLoading,
    error: locationError,
  } = useSWR('/api/salonapp/location', fetcher);

  if (locationError) return <div>Failed to load</div>;
  if (!location) return <div>Loading...</div>;

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
            name: t('salonapp.location.locations'),
            href: paths.dashboard.employees.timeslots.root,
          },
          { name: location?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LocationNewEditForm currentLocation={location?.data[0]} />
    </DashboardContent>
  );
}
