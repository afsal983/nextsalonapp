import { OrganizationCreateView } from "src/sections/organization/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Organization Create",
};

export default async function OrganizationCreatePage() {
  return <OrganizationCreateView />;
}
