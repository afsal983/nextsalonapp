import { _userList } from "src/_mock/_user";

import { CustomerCategoryEditView } from "src/sections/customercategory/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: CustomerCategory Edit",
};

interface Props {
  params: {
    id: string;
  };
}

export default function CustomerCategoryEditPage({ params }: Props) {
  const { id } = params;

  return <CustomerCategoryEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
