import { _jobs } from 'src/_mock/_job';

import { ReportDetailsView } from 'src/sections/reports/view';

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

  return <ReportDetailsView id={id} />;
}

export async function generateStaticParams() {
  return _jobs.map((job) => ({
    id: job.id,
  }));
}
