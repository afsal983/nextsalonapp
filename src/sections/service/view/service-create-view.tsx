"use client";

import useSWR from "swr";

import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";

import { fetcher } from "src/utils/axios";

import { useTranslate } from "src/locales";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import ServiceNewEditForm from "../service-new-edit-form";

// ----------------------------------------------------------------------

export default function ServiceCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Pre data fetching via API calls
  const { data: servicecategory, isLoading: isservicecategoryLoading } = useSWR(
    "/api/salonapp/servicecategory",
    fetcher
  );
  const { data: retailbrands, isLoading: isretailbrandsLoading } = useSWR(
    "/api/salonapp/retailbrand",
    fetcher
  );

  // Wait for data loading
  if (isservicecategoryLoading || isretailbrandsLoading)
    return <div>Loading...</div>;
  if (!servicecategory || !retailbrands) return <div>Loading...</div>;

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading={t("salonapp.service.create_a_new_service")}
        links={[
          {
            name: t("salonapp.dashboard"),
            href: paths.dashboard.root,
          },
          {
            name: t("salonapp.services"),
            href: paths.dashboard.services.root,
          },
          { name: t("salonapp.service.new_service") },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm
        servicecategory={servicecategory.data}
        retailbrands={retailbrands.data}
      />
    </Container>
  );
}
