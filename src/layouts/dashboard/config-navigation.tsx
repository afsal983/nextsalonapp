import { useMemo } from 'react'

import { paths } from 'src/routes/paths'

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
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Analysis',
        items: [
          {
            title: 'dashboard',
            path: paths.dashboard.root,
            icon: ICONS.dashboard
          }
        ]
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'services',
            path: paths.dashboard.services.root,
            icon: ICONS.services,
            children: [
              { title: 'service list', path: paths.dashboard.services.root },
              {
                title: 'service category',
                path: paths.dashboard.services.servicecategory.root
              }
            ]
          },
          {
            title: 'retails',
            path: paths.dashboard.retails.root,
            icon: ICONS.retails,
            children: [
              { title: 'retail list', path: paths.dashboard.retails.root },
              { title: 'retail category', path: paths.dashboard.retails.root },
              { title: 'retail brand', path: paths.dashboard.retails.root }
            ]
          },
          {
            title: 'packages',
            path: paths.dashboard.packages.root,
            icon: ICONS.packages,
            children: [
              { title: 'package list', path: paths.dashboard.packages.root },
              {
                title: 'paackage category',
                path: paths.dashboard.packages.root
              }
            ]
          },
          {
            title: 'appointments',
            path: paths.dashboard.retails.root,
            icon: ICONS.appointments
          },
          {
            title: 'invoices',
            path: paths.dashboard.retails.root,
            icon: ICONS.invoices,
            children: [
              { title: 'invoice list', path: paths.dashboard.retails.root },
              { title: 'payment types', path: paths.dashboard.retails.root }
            ]
          },
          {
            title: 'employees',
            path: paths.dashboard.retails.root,
            icon: ICONS.employees,
            children: [
              { title: 'emloyee', path: paths.dashboard.retails.root },
              { title: 'work schedule', path: paths.dashboard.retails.root },
              { title: 'timeslots', path: paths.dashboard.retails.root }
            ]
          },
          {
            title: 'locations',
            path: paths.dashboard.retails.root,
            icon: ICONS.locations
          },
          {
            title: 'organizations',
            path: paths.dashboard.retails.root,
            icon: ICONS.organizations
          },
          {
            title: 'branches',
            path: paths.dashboard.retails.root,
            icon: ICONS.branches
          },
          {
            title: 'reports',
            path: paths.dashboard.retails.root,
            icon: ICONS.reports
          },
          {
            title: 'audits',
            path: paths.dashboard.retails.root,
            icon: ICONS.audits
          },
          {
            title: 'settings',
            path: paths.dashboard.retails.root,
            icon: ICONS.settings
          },
          {
            title: 'users',
            path: paths.dashboard.retails.root,
            icon: ICONS.users,
            children: [
              { title: 'user list', path: paths.dashboard.retails.root },
              { title: 'roles', path: paths.dashboard.retails.root }
            ]
          },
          {
            title: 'message builder',
            path: paths.dashboard.retails.root,
            icon: ICONS.messagebuilder
          },
          {
            title: 'maketing',
            path: paths.dashboard.retails.root,
            icon: ICONS.marketing,
            children: [
              { title: 'campaign content', path: paths.dashboard.retails.root },
              { title: 'campaigns', path: paths.dashboard.retails.root }
            ]
          },
          {
            title: 'adapters',
            path: paths.dashboard.retails.root,
            icon: ICONS.adapters,
            children: [
              { title: 'email', path: paths.dashboard.retails.root },
              { title: 'whatsapp', path: paths.dashboard.retails.root }
            ]
          }
        ]
      }
    ],
    []
  )

  return data
}
