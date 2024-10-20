import { _userList } from "src/_mock/_user";

import { AppointmentDetailsView } from "src/sections/appointment/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Branch Edit",
};

interface Props {
  params: {
    id: string;
  };
}

export default function AppointmentEditPage({ params }: Props) {
  const { id } = params;

  return <AppointmentDetailsView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
