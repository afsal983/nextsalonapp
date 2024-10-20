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

import SettingsGeneral from "../settings-general";
import SettingsInvoice from "../settings-invoice";
import SettingsAppointment from "../settings-appointment";
import SettingsSocialLinks from "../settings-social-links";
import AccountNotifications from "../account-notifications";

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

export default function AccountView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState("general");

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    []
  );

  const {
    data: settingsData,
    isLoading,
    error: categoryError,
  } = useSWR(`/api/salonapp/settings`, fetcher);

  if (categoryError) return <div>Failed to load</div>;
  if (isLoading || !settingsData) return <div>Loading...</div>;

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Account"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "User", href: paths.dashboard.user.root },
          { name: "Account" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      {currentTab === "general" && (
        <SettingsGeneral currentSettings={settingsData.data} />
      )}

      {currentTab === "invoice" && (
        <SettingsInvoice currentSettings={settingsData.data} />
      )}

      {currentTab === "appointment" && (
        <SettingsAppointment currentSettings={settingsData.data} />
      )}

      {currentTab === "notifications" && (
        <AccountNotifications currentSettings={settingsData.data} />
      )}

      {currentTab === "social" && (
        <SettingsSocialLinks socialLinks={_userAbout.socialLinks} />
      )}
    </Container>
  );
}
