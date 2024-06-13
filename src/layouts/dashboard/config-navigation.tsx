import { useMemo } from 'react'

import { paths } from 'src/routes/paths'

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color'

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
)

const ICONS = {
  dashboard: icon('ic_dashboard'),
  services: icon('ic_job'),
  retails: icon('ic_blog'),
  packages: icon('ic_chat'),
  appointments: icon('ic_mail'),
  invoices: icon('ic_user'),
  employees: icon('ic_file'),
  locations: icon('ic_lock'),
  organizations: icon('ic_tour'),
  branches: icon('ic_order'),
  reports: icon('ic_label'),
  audits: icon('ic_blank'),
  settings: icon('ic_kanban'),
  users: icon('ic_folder'),
  messagebuilder: icon('ic_banking'),
  marketing: icon('ic_booking'),
  adapters: icon('ic_invoice')
}

// ----------------------------------------------------------------------

export function useNavData () {
  const { t } = useTranslate();
  
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('salonapp.dashboard'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard
          }
        ]
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('salonapp.management'),
        items: [
          {
            title: t('salonapp.services'),
            path: paths.dashboard.services.root,
            icon: ICONS.services,
            children: [
              { title: t('salonapp.service_list'), path: paths.dashboard.services.root },
              {
                title: t('salonapp.service_category'),
                path: paths.dashboard.services.servicecategory.root
              }
            ]
          },
          {
            title: t('salonapp.retails'),
            path: paths.dashboard.retails.root,
            icon: ICONS.retails,
            children: [
              { title: t('salonapp.retail_list'), path: paths.dashboard.retails.root },
              { title: t('salonapp.retail_category'), path: paths.dashboard.retails.root },
              { title: t('salonapp.retail_brand'), path: paths.dashboard.retails.root }
            ]
          },
          {
            title: t('salonapp.packages'),
            path: paths.dashboard.packages.root,
            icon: ICONS.packages,
            children: [
              { title: t('salonapp.package_list'), path: paths.dashboard.packages.root },
              {
                title: t('salonapp.package_category'),
                path: paths.dashboard.packages.root
              }
            ]
          },
          {
            title: t('salonapp.appointments'),
            path: paths.dashboard.retails.root,
            icon: ICONS.appointments
          },
          {
            title: t('salonapp.invoices'),
            path: paths.dashboard.invoice.root,
            icon: ICONS.invoices,
            children: [
              { title: t('salonapp.invoice_list'), path: paths.dashboard.invoice.root },
              { title: t('salonapp.payment_types'), path: paths.dashboard.invoice.root }
            ]
          },
          {
            title: t('salonapp.employees'),
            path: paths.dashboard.retails.root,
            icon: ICONS.employees,
            children: [
              { title: t('salonapp.employee'), path: paths.dashboard.retails.root },
              { title: t('salonapp.work_schedule'), path: paths.dashboard.retails.root },
              { title: t('salonapp.timeslots'), path: paths.dashboard.retails.root }
            ]
          },
          {
            title: t('salonapp.locations'),
            path: paths.dashboard.retails.root,
            icon: ICONS.locations
          },
          {
            title: t('salonapp.organizations'),
            path: paths.dashboard.retails.root,
            icon: ICONS.organizations
          },
          {
            title: t('salonapp.branches'),
            path: paths.dashboard.retails.root,
            icon: ICONS.branches
          },
          {
            title: t('salonapp.reports'),
            path: paths.dashboard.report.root,
            icon: ICONS.reports
          },
          {
            title: t('salonapp.audits'),
            path: paths.dashboard.retails.root,
            icon: ICONS.audits
          },
          {
            title: t('salonapp.settings'),
            path: paths.dashboard.retails.root,
            icon: ICONS.settings
          },
          {
            title: t('salonapp.users'),
            path: paths.dashboard.retails.root,
            icon: ICONS.users,
            children: [
              { title: t('salonapp.user_list'), path: paths.dashboard.retails.root },
              { title: t('salonapp.roles'), path: paths.dashboard.retails.root }
            ]
          },
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
        ]
      }
    ],
    [t]
  )

  return data
}
