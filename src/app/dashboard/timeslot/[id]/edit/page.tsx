import { _userList } from 'src/_data/_user';

import { TimeSlotEditView } from 'src/sections/timeslot/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: TimeSlot Edit',
};

interface Props {
  params: {
    id: string;
  };
}

export default function TimeSlotEditPage({ params }: Props) {
  const { id } = params;

  return <TimeSlotEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
