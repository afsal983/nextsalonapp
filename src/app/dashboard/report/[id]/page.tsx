import { _jobs } from 'src/_data/_job';

import { SalesReportListView } from 'src/sections/reports/sales/view';
import { ProductReportListView } from 'src/sections/reports/product/view';
import { ExpenseReportListView } from 'src/sections/reports/expense/view';
import { CustomerReportListView } from 'src/sections/reports/customer/view';
import { DetailedSalesListView } from 'src/sections/reports/detailedsales/view';
import { AppointmentReportListView } from 'src/sections/reports/appointment/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Report Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ReportDetailsPage({ params }: Props) {
  const { id } = params;

  switch (id) {
    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7a1':
      return <SalesReportListView />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4':
      return <DetailedSalesListView />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1':
      return <AppointmentReportListView />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7ed1':
      return <CustomerReportListView />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7c1':
      return <ProductReportListView />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7e1':
      return <ExpenseReportListView />;

    default:
      return <DetailedSalesListView />;
  }
}

export async function generateStaticParams() {
  return _jobs.map((job) => ({
    id: job.id,
  }));
}
