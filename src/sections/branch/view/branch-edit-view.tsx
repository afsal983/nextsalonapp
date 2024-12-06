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

import BranchNewEditForm from '../branch-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function BranchEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: branchData, error: categoryError } = useSWR(
    `/api/salonapp/branches/${id}`,
    fetcher
  );
  const { data: organization, error: organizationError } = useSWR(
    '/api/salonapp/organization',
    fetcher
  );
  const { data: location, error: locationError } = useSWR('/api/salonapp/location', fetcher);

  if (categoryError || organizationError || locationError) return <div>Failed to load</div>;
  if (!organization || !branchData || !organization) return <div>Loading...</div>;

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
            name: t('salonapp.services'),
            href: paths.dashboard.employees.timeslots.root,
          },
          { name: branchData?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BranchNewEditForm
        currentBranch={branchData?.data[0]}
        organization={organization.data}
        location={location.data}
      />
    </DashboardContent>
  );
}
