"use client";
import { useState } from "react";
import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";

import { _userList } from "src/_mock";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import useSWR from "swr";
import { fetcher } from "src/utils/axios";

import ServiceNewEditForm from "../service-new-edit-form";
import React from "react";
import { IServiceItem } from "src/types/service";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ServiceEditView({ id }: Props) {
  const settings = useSettingsContext();

  //const currentService = _userList.find((user) => user.id === id);
  const [ServiceData, setServiceData] = useState<IServiceItem>();

  //Get the all the services
  const { data, error, isLoading } = useSWR(
    "/apiserver/products/{id}",
    fetcher,
    {
      onSuccess: (data) => {
        setServiceData(data.data); // this seems to use fetched data as needed without useEffect
      },
    },
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "User",
            href: paths.dashboard.services.root,
          },
          { name: ServiceData?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm currentService={ServiceData} />
    </Container>
  );
}
