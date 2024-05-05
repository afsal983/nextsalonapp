import { OverviewEcommerceView } from "src/sections/dashboard/general/view";
import { cookies } from 'next/headers'
import useSWR from "swr";
import { fetcher } from "src/utils/axios";


// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: E-Commerce",
};

export default async function OverviewEcommercePage() {

  return <OverviewEcommerceView />;
}