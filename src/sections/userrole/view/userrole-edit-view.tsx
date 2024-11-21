"use client";

import useSWR from "swr";
import { useState, useCallback } from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Container from "@mui/material/Container";

import { paths } from "src/routes/paths";

import { fetcher } from "src/utils/axios";

import { _userAbout } from "src/_mock";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

// ----------------------------------------------------------------------

const TABS = [
  {
    value: "general",
    label: "General",
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: "invoice",
    label: "Invoice",
    icon: <Iconify icon="mdi:invoice-clock" width={24} />,
  },
  {
    value: "appointment",
    label: "Appointment",
    icon: <Iconify icon="teenyicons:appointments-solid" width={24} />,
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  {
    value: "social",
    label: "Social links",
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function UserRoleEditView() {
  return <div>Coming soon</div>;
}
