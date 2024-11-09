"use client";

import useSWR from "swr";
import React from "react";
import { usePathname } from "next/navigation";

import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";

import { fetcher } from "src/utils/axios";

import { useTranslate } from "src/locales";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import PublicAppointmentCreateView from "../public-appointment-create-view";

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function TimeSlotEditView() {
  const { t } = useTranslate();

  const pathname = usePathname();
  const parts = pathname.split("/");

  const settings = useSettingsContext();

  const { data, isLoading, error } = useSWR(
    `/api/public?name=${parts[2]}`,
    fetcher
  );

  const {
    data: employeeData,
    isLoading: isemployeeLoading,
    error: ErrorE,
  } = useSWR(`/api/salonapp/publicappointment/getemployeesforpublic`, fetcher);

  const {
    data: servicecategoryData,
    isLoading: iscatLoading,
    error: ErrorC,
  } = useSWR(
    `/api/salonapp/publicappointment/categorizedproductlistforpublic`,
    fetcher
  );

  if (error || ErrorE || ErrorC) return <div>Failed to load</div>;
  if (isLoading || iscatLoading || isemployeeLoading)
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
          {
            name: t("salonapp.services"),
            href: paths.dashboard.employees.timeslots.root,
          },
          { name: servicecategoryData?.data[0].name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <PublicAppointmentCreateView
        serviceCategory={servicecategoryData?.data}
        employees={employeeData?.data}
      />
    </Container>
  );
}
