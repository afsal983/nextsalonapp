import { _jobs } from 'src/_mock/_job';

import SalesReportDetailsView from 'src/sections/reports/sales/salesreport-details-view';

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

  switch(id) {
    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3':  
      return <SalesReportDetailsView reportid={id} />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4':  
      return <SalesReportDetailsView reportid={id} />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5':  
      return <SalesReportDetailsView reportid={id} />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6':  
      return <SalesReportDetailsView reportid={id} />;

    case 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7':  
      return <SalesReportDetailsView reportid={id} />;

    default:
      return <SalesReportDetailsView reportid={id} />;
  }
}

export async function generateStaticParams() {
  return _jobs.map((job) => ({
    id: job.id,
  }));
}
