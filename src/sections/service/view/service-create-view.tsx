"use client";

import Container from "@mui/material/Container";
import { useState } from "react";

import { paths } from "src/routes/paths";

import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import useSWR from "swr";
import { fetcher } from "src/utils/axios";

import ServiceNewEditForm from "../service-new-edit-form";
import { IServiceItem, ServiceCategoryItem } from "src/types/service";

// ----------------------------------------------------------------------

export default function ServiceCreateView() {
  const settings = useSettingsContext();

  const [productCategory, setproductCategory] = useState<ServiceCategoryItem[]>([]);
    //Get the all the service categories
    const result = useSWR("/apiserver/productcategories?type=1", fetcher, {
      onSuccess: (data) => {
        const category = data.data.map((item: IServiceItem) => item.name);
        setproductCategory(data.data); // this seems to use fetched data as needed without useEffect
      },
    });

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Create a new service"
        links={[
          {
            name: "Dashboard",
            href: paths.dashboard.root,
          },
          {
            name: "Services",
            href: paths.dashboard.services.root,
          },
          { name: "New Service" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm productcategory={productCategory}/>
    </Container>
  );
}
