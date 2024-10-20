import { PaymentTypeCreateView } from "src/sections/paymenttype/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Paymenttype Create",
};

export default async function ServiceCategoryCreatePage() {
  return <PaymentTypeCreateView />;
}
