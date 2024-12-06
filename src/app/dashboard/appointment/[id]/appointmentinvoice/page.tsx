import { _userList } from 'src/_data/_user';

import { AppointmentInvoiceView } from 'src/sections/appointment/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Appointment Invoice',
};

interface Props {
  params: {
    id: string;
  };
}

export default function AppointmenInvoicePage({ params }: Props) {
  const { id } = params;
  return <AppointmentInvoiceView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
