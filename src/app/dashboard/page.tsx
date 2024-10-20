import { OverviewSalonView } from "src/sections/dashboard/general/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: SMEEYE SALONAPP",
};

export default async function OverviewEcommercePage() {
  console.log("Dashboard");
  return <OverviewSalonView />;
}
