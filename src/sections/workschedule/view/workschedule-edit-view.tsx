"use client";

import useSWR from "swr";
import React from "react";

import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";

import { fetcher } from "src/utils/axios";

import { useTranslate } from "src/locales";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import WorkScheduleNewEditForm from "../workschedule-new-edit-form";

// ----------------------------------------------------------------------

export default function WorkScheduleEditView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { data: workscheduleData, error: wError } = useSWR(
    `/api/salonapp/workschedule`,
    fetcher
  );
  const { data: timeslotData, error: tError } = useSWR(
    `/api/salonapp/timeslot`,
    fetcher
  );
  const { data: employeeData, error: eError } = useSWR(
    `/api/salonapp/employee`,
    fetcher
  );

  if (wError || tError || eError) return <div>Failed to load</div>;
  if (!workscheduleData || !timeslotData || !employeeData)
    return <div>Loading...</div>;

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: t("salonapp.dashboard"),
            href: paths.dashboard.root,
          },
          { name: t("salonapp.workschedule.workschedules") },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <WorkScheduleNewEditForm
        currentWorkSchedule={workscheduleData.data}
        timeSlot={timeslotData.data}
        employee={employeeData.data}
      />
    </Container>
  );
}
