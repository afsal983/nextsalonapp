import { _userList } from 'src/_data/_user';

import { CustomerEditView } from 'src/sections/customer/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Customer Edit',
};

interface Props {
  params: {
    id: string;
  };
}

export default function CustomerEditPage({ params }: Props) {
  const { id } = params;

  return <CustomerEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
