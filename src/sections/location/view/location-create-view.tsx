'use client';

import useSWR from 'swr';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LocationNewEditForm from '../location-new-edit-form';

// ----------------------------------------------------------------------

export default function LocationCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: location, isLoading: islocationLoading } = useSWR(
    '/api/salonapp/location',
    fetcher
  );

  // Wait for data loading
  if (islocationLoading) return <div>Loading...</div>;
  if (!location) return <div>Loading...</div>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.location.create_location')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.location.locations'),
            href: paths.dashboard.branches.root,
          },
          { name: t('salonapp.location.create_location') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <LocationNewEditForm />
    </DashboardContent>
  );
}
