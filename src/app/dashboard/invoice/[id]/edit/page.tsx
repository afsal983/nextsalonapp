import { _userList } from 'src/_data/_user';

import { InvoiceEditView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Invoice Edit',
};

interface Props {
  params: {
    id: string;
  };
}

export default function InvoiceEditPage({ params }: Props) {
  const { id } = params;

  return <InvoiceEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
