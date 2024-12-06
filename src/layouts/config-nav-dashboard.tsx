import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { useTranslate } from 'src/locales';
// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  services: icon('ic_services'),
  customers: icon('ic_customers'),
  retails: icon('ic_blog'),
  packages: icon('ic_chat'),
  appointments: icon('ic_appointments'),
  invoices: icon('ic_invoices'),
  employees: icon('ic_employees'),
  locations: icon('ic_locations'),
  organizations: icon('ic_organizations'),
  branches: icon('ic_branches'),
  reports: icon('ic_reports'),
  audits: icon('ic_audits'),
  settings: icon('ic_settings'),
  users: icon('ic_users'),
  messagebuilder: icon('ic_messagebuilder'),
  marketing: icon('ic_marketing'),
  adapters: icon('ic_adapters'),
};

// ----------------------------------------------------------------------

export const navData = [
  // OVERVIEW
  // ----------------------------------------------------------------------
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------

  {
    subheader: 'Management',
    items: [
      {
        title: 'Customers',
        path: paths.dashboard.customers.root,
        icon: ICONS.customers,
        children: [
          {
            title: 'Customer List',
            path: paths.dashboard.customers.root,
          },
          {
            title: 'Customer Category',
            path: paths.dashboard.customers.customercategory.root,
          },
        ],
      },
      {
        title: 'Services',
        path: paths.dashboard.services.root,
        icon: ICONS.services,
        children: [
          {
            title: 'Service List',
            path: paths.dashboard.services.root,
          },
          {
            title: 'Service Category',
            path: paths.dashboard.services.servicecategory.root,
          },
          {
            title: 'Retail Brand',
            path: paths.dashboard.retailbrands.root,
          },
        ],
      },
      {
        title: 'Appointments',
        path: paths.dashboard.appointments.root,
        icon: ICONS.appointments,
        children: [
          {
            title: 'Appointments',
            path: paths.dashboard.appointments.root,
          },
          {
            title: 'Calendar',
            path: paths.dashboard.appointments.calander.root,
          },
        ],
      },
      {
        title: 'Invoices',
        path: paths.dashboard.invoice.root,
        icon: ICONS.invoices,
        children: [
          {
            title: 'Invoice List',
            path: paths.dashboard.invoice.root,
          },
          {
            title: 'Payment Types',
            path: paths.dashboard.invoice.paymenttypes.root,
          },
        ],
      },
      {
        title: 'Employees',
        path: paths.dashboard.employees.root,
        icon: ICONS.employees,
        children: [
          {
            title: 'Employee',
            path: paths.dashboard.employees.root,
          },
          {
            title: 'Work Schedule',
            path: paths.dashboard.employees.workschedule.root,
          },
          {
            title: 'Time Slots',
            path: paths.dashboard.employees.timeslots.root,
          },
        ],
      },
      {
        title: 'Locations',
        path: paths.dashboard.location.root,
        icon: ICONS.locations,
      },
      {
        title: 'Organizations',
        path: paths.dashboard.organization.root,
        icon: ICONS.organizations,
      },
      {
        title: 'Branches',
        path: paths.dashboard.branches.root,
        icon: ICONS.branches,
      },
      {
        title: 'Reports',
        path: paths.dashboard.report.root,
        icon: ICONS.reports,
      },
      {
        title: 'Audits',
        path: paths.dashboard.retails.root,
        icon: ICONS.audits,
      },
      {
        title: 'Settings',
        path: paths.dashboard.settings.root,
        icon: ICONS.settings,
      },
      {
        title: 'Users',
        path: paths.dashboard.user.root,
        icon: ICONS.users,
        children: [
          {
            title: 'User List',
            path: paths.dashboard.user.root,
          },
          {
            title: 'Roles',
            path: paths.dashboard.user.userrole.root,
          },
        ],
      },
    ],
  },
];
