import { _jobs } from 'src/_mock/_job';

import { ReportEditView } from 'src/sections/reports/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Job Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function JobEditPage({ params }: Props) {
  const { id } = params;

  return <ReportEditView id={id} />;
}

export async function generateStaticParams() {
  return _jobs.map((job) => ({
    id: job.id,
  }));
}
