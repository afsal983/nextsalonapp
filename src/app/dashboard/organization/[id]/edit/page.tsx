import { _userList } from 'src/_data/_user';

import { OrganizationEditView } from 'src/sections/organization/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Organization Edit',
};

interface Props {
  params: {
    id: string;
  };
}

export default function OrganizationEditPage({ params }: Props) {
  const { id } = params;

  return <OrganizationEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
