import { useMemo } from "react";

import { paths } from "src/routes/paths";

import { useTranslate } from "src/locales";

import SvgColor from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon("ic_dashboard"),
  services: icon("ic_services"),
  customers: icon("ic_customers"),
  retails: icon("ic_blog"),
  packages: icon("ic_chat"),
  appointments: icon("ic_appointments"),
  invoices: icon("ic_invoices"),
  employees: icon("ic_employees"),
  locations: icon("ic_locations"),
  organizations: icon("ic_organizations"),
  branches: icon("ic_branches"),
  reports: icon("ic_reports"),
  audits: icon("ic_audits"),
  settings: icon("ic_settings"),
  users: icon("ic_users"),
  messagebuilder: icon("ic_messagebuilder"),
  marketing: icon("ic_marketing"),
  adapters: icon("ic_adapters"),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t("overview"),
        items: [
          {
            title: t("salonapp.dashboard"),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t("salonapp.management"),
        items: [
          {
            title: t("salonapp.customers"),
            path: paths.dashboard.customers.root,
            icon: ICONS.customers,
            children: [
              {
                title: t("salonapp.customer.customer_list"),
                path: paths.dashboard.customers.root,
              },
              {
                title: t("salonapp.customer_category"),
                path: paths.dashboard.customers.customercategory.root,
              },
            ],
          },
          {
            title: t("salonapp.services"),
            path: paths.dashboard.services.root,
            icon: ICONS.services,
            children: [
              {
                title: t("salonapp.service_list"),
                path: paths.dashboard.services.root,
              },
              {
                title: t("salonapp.service_category"),
                path: paths.dashboard.services.servicecategory.root,
              },
              {
                title: t("general.retail_brand"),
                path: paths.dashboard.retailbrands.root,
              },
            ],
          },
          {
            title: t("salonapp.appointments"),
            path: paths.dashboard.appointments.root,
            icon: ICONS.appointments,
            children: [
              {
                title: t("salonapp.appointments"),
                path: paths.dashboard.appointments.root,
              },
              {
                title: t("salonapp.calander"),
                path: paths.dashboard.appointments.calander.root,
              },
            ],
          },
          {
            title: t("salonapp.invoices"),
            path: paths.dashboard.invoice.root,
            icon: ICONS.invoices,
            children: [
              {
                title: t("salonapp.invoice_list"),
                path: paths.dashboard.invoice.root,
              },
              {
                title: t("salonapp.payment_types"),
                path: paths.dashboard.invoice.paymenttypes.root,
              },
            ],
          },
          {
            title: t("general.employees"),
            path: paths.dashboard.employees.root,
            icon: ICONS.employees,
            children: [
              {
                title: t("general.employee"),
                path: paths.dashboard.employees.root,
              },
              {
                title: t("salonapp.work_schedule"),
                path: paths.dashboard.employees.workschedule.root,
              },
              {
                title: t("salonapp.timeslots"),
                path: paths.dashboard.employees.timeslots.root,
              },
            ],
          },
          {
            title: t("salonapp.location.locations"),
            path: paths.dashboard.location.root,
            icon: ICONS.locations,
          },
          {
            title: t("salonapp.organizations"),
            path: paths.dashboard.organization.root,
            icon: ICONS.organizations,
          },
          {
            title: t("salonapp.branches"),
            path: paths.dashboard.branches.root,
            icon: ICONS.branches,
          },
          {
            title: t("salonapp.reports"),
            path: paths.dashboard.report.root,
            icon: ICONS.reports,
          },
          {
            title: t("salonapp.audits"),
            path: paths.dashboard.retails.root,
            icon: ICONS.audits,
          },
          {
            title: t("salonapp.settings"),
            path: paths.dashboard.settings.root,
            icon: ICONS.settings,
          },
          {
            title: t("salonapp.users"),
            path: paths.dashboard.user.root,
            icon: ICONS.users,
            children: [
              {
                title: t("salonapp.user_list"),
                path: paths.dashboard.user.root,
              },
              {
                title: t("salonapp.roles"),
                path: paths.dashboard.user.userrole.root,
              },
            ],
          },
          /*
          {
            title: t('salonapp.message_builder'),
            path: paths.dashboard.retails.root,
            icon: ICONS.messagebuilder
          },
          {
            title: t('salonapp.marketing'),
            path: paths.dashboard.retails.root,
            icon: ICONS.marketing,
            children: [
              { title: t('salonapp.campaign_content'), path: paths.dashboard.retails.root },
              { title: t('salonapp.campaigns'), path: paths.dashboard.retails.root }
            ]
          },
          {
            title: t('salonapp.adapters'),
            path: paths.dashboard.retails.root,
            icon: ICONS.adapters,
            children: [
              { title: t('salonapp.email'), path: paths.dashboard.retails.root },
              { title: t('salonapp.whatsapp'), path: paths.dashboard.retails.root }
            ]
          }
          */
        ],
      },
    ],
    [t]
  );

  return data;
}
