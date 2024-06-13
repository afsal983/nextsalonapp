'use client';

import useSWR from 'swr';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InvoiceDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  // const currentInvoice = _invoices.filter((invoice) => invoice.id === id)[0];

  // Use SWR to fetch data from multiple endpoints in parallel
  const { data: currentInvoice,isLoading: isinvoiceLoading,  error: errorC } = useSWR(`/api/salonapp/invoice/${id}`, fetcher);

  if ( isinvoiceLoading ) return <div>Loading...</div>;
  if ( errorC ) return <div>Error Loading...</div>;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentInvoice?.invoiceNumber}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Invoice',
            href: paths.dashboard.invoice.root,
          },
          { name: currentInvoice?.invoiceNumber },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceDetails invoice={currentInvoice.data[0]} />
    </Container>
  );
}
