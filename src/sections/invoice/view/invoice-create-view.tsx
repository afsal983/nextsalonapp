'use client';

import useSWR from 'swr';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceNewEditForm from '../invoice-new-edit-form';

// ----------------------------------------------------------------------

export default function InvoiceCreateView() {
  const settings = useSettingsContext();

    // Use SWR to fetch data from multiple endpoints in parallel
    const { data: service,isLoading: isserviceLoading,  error: errorS } = useSWR('/api/salonapp/services', fetcher);
    const { data: branches,isLoading: isbranchesLoading,  error: errorB } = useSWR('/api/salonapp/branches', fetcher);
    const { data: employees,isLoading: isEmployeeLoading,  error: errorE } = useSWR('/api/salonapp/employee', fetcher);
    const { data: appsettings,isLoading: isAppSettingsLoading,  error: errorI } = useSWR('/api/salonapp/settings', fetcher);
    const { data: paymenttypes,isLoading: isPaymenttypesLoading,  error: errorP } = useSWR('/api/salonapp/paymentypes', fetcher);

    if ( isserviceLoading || isbranchesLoading || isEmployeeLoading || isAppSettingsLoading || isPaymenttypesLoading ) return <div>Loading...</div>;
    if ( errorS || errorB || errorE  || errorI || errorP) return <div>Error Loading...</div>;


    if(appsettings) {
      console.log(appsettings)
    }
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new invoice"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Invoice',
            href: paths.dashboard.invoice.root,
          },
          {
            name: 'New Invoice',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvoiceNewEditForm services={service.data} branches={branches.data} employees={employees.data} appsettings={appsettings.data} paymenttypes={paymenttypes.data}/>
    </Container>
  );
}
