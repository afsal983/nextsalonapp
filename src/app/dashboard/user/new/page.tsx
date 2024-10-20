import { UserCreateView } from "src/sections/user/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: User New",
};

export default async function UserCreatePage() {
  return <UserCreateView />;
}
