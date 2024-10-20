import { LocationCreateView } from "src/sections/location/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Location New",
};

export default async function LocationCreatePage() {
  return <LocationCreateView />;
}
