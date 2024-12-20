'use client';

import useSWR from 'swr';
import React from 'react';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import TimeSlotNewEditForm from '../timeslot-new-edit-form';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function TimeSlotEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const {
    data: servicecategoryData,
    isLoading,
    error: categoryError,
  } = useSWR(`/api/salonapp/timeslot/${id}`, fetcher);

  if (categoryError) return <div>Failed to load</div>;
  if (isLoading || !servicecategoryData) return <div>Loading...</div>;

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
            name: t('salonapp.timeslot.name'),
            href: paths.dashboard.employees.timeslots.root,
          },
          { name: servicecategoryData?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TimeSlotNewEditForm currentTimeSlot={servicecategoryData?.data[0]} />
    </DashboardContent>
  );
}
