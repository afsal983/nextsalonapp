import { CustomerCreateView } from "src/sections/customer/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Create new customer",
};

export default async function CustomerCreatePage() {
  return <CustomerCreateView />;
}
