import { _jobs } from "src/_mock/_job";

import { SalesReportListView } from "src/sections/reports/sales/view";
// import SalesReportDetailsView from "src/sections/reports/sales/salesreport-details-view";
import { DetailedSalesListView } from "src/sections/reports/detailedsales/view";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Report Details",
};

type Props = {
  params: {
    id: string;
  };
};

export default function ReportDetailsPage({ params }: Props) {
  const { id } = params;

  switch (id) {
    case "e99f09a7-dd88-49d5-b1c8-1daf80c2d7a1":
      return <SalesReportListView />;

    case "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4":
      return <DetailedSalesListView />;
    default:
      return <DetailedSalesListView />;
  }
}

export async function generateStaticParams() {
  return _jobs.map((job) => ({
    id: job.id,
  }));
}
