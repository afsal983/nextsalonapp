import { AppointmentCreateView } from "src/sections/appointment/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Create new appointment",
};

export default async function AppointmentCreatePage() {
  return <AppointmentCreateView />;
}
