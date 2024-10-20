import { CustomerCategoryCreateView } from "src/sections/customercategory/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: New Customercategory",
};

export default async function CustomerCategoryCreatePage() {
  return <CustomerCategoryCreateView />;
}
