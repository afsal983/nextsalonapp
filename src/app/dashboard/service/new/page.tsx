import { ServiceCreateView } from "src/sections/service/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Service New",
};

export default async function ServiceCreatePage() {
  return <ServiceCreateView />;
}
