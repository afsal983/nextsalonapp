import { _userList } from "src/_mock/_user";

import { BranchEditView } from "src/sections/branch/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Branch Edit",
};

interface Props {
  params: {
    id: string;
  };
}

export default function BranchEditPage({ params }: Props) {
  const { id } = params;

  return <BranchEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}
