import { _userList } from 'src/_data/_user';

import { ServiceCategoryEditView } from 'src/sections/servicecategory/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: ServiceCategory Edit',
};

interface Props {
  params: {
    id: string;
  };
}

export default function ServiceCategoryEditPage({ params }: Props) {
  const { id } = params;

  return <ServiceCategoryEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
