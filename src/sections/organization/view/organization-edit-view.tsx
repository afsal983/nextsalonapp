'use client';

import useSWR from 'swr';
import React from 'react';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import OrganizationNewEditForm from '../organization-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function OrganizationEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: organization, error: organizationError } = useSWR(
    '/api/salonapp/organization',
    fetcher
  );

  if (organizationError) return <div>Failed to load</div>;
  if (!organization) return <div>Loading...</div>;

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
            name: t('salonapp.organization.organizations'),
            href: paths.dashboard.organization.root,
          },
          { name: organization?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <OrganizationNewEditForm currentOrganization={organization?.data[0]} />
    </DashboardContent>
  );
}
