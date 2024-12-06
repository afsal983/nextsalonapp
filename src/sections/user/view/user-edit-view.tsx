'use client';

import useSWR from 'swr';
import React from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function UserEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: userData, error: userError } = useSWR(`/api/salonapp/user/${id}`, fetcher);
  const { data: userroleData, error: categoryError } = useSWR(`/api/salonapp/userrole`, fetcher);
  const { data: branches, error: branchError } = useSWR('/api/salonapp/branches', fetcher);

  if (userError || categoryError || branchError) return <div>Failed to load</div>;
  if (!userData || !userroleData || !branches) return <div>Loading...</div>;

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
            name: t('salonapp.user.users'),
            href: paths.dashboard.user.root,
          },
          { name: userData?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm
        currentUser={userData?.data[0]}
        userroles={userroleData?.data}
        branches={branches?.data}
      />
    </Container>
  );
}
