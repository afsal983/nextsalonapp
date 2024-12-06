'use client';






import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'invoice',
    label: 'Invoice',
    icon: <Iconify icon="mdi:invoice-clock" width={24} />,
  },
  {
    value: 'appointment',
    label: 'Appointment',
    icon: <Iconify icon="teenyicons:appointments-solid" width={24} />,
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  },
  {
    value: 'social',
    label: 'Social links',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function UserRoleEditView() {
  return <div>Coming soon</div>;
}
