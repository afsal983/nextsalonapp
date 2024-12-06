import { _userList } from 'src/_data/_user';

import { AppointmentEditView } from 'src/sections/appointment/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Branch Edit',
};

interface Props {
  params: {
    id: string;
  };
}

export default function BranchEditPage({ params }: Props) {
  const { id } = params;
  return <AppointmentEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
