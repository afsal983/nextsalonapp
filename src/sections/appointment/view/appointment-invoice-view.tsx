'use client';

import useSWR from 'swr';
import React from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import InvoiceNewEditForm from 'src/sections/invoice/invoice-new-edit-form';

import { Invoice_line } from 'src/types/invoice';
import { Additional_products } from 'src/types/appointment';

// ----------------------------------------------------------------------

interface Props {
  id: string;
}

export default function OrganizationEditView({ id }: Props) {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  // Use SWR to fetch data from multiple endpoints in parallel and pass them to invoice New Edit form
  const {
    data: currentappointment,
    isLoading: iscurrentappLoading,
    error: errorC,
  } = useSWR(`/api/salonapp/appointments/${id}`, fetcher);

  // Use SWR to fetch data from multiple endpoints in parallel and pass them to invoice New Edit form
  const {
    data: service,
    isLoading: isserviceLoading,
    error: errorS,
  } = useSWR('/api/salonapp/services', fetcher);
  const {
    data: branches,
    isLoading: isbranchesLoading,
    error: errorB,
  } = useSWR('/api/salonapp/branches', fetcher);
  const {
    data: employees,
    isLoading: isEmployeeLoading,
    error: errorE,
  } = useSWR('/api/salonapp/employee', fetcher);
  const {
    data: appsettings,
    isLoading: isAppSettingsLoading,
    error: errorI,
  } = useSWR('/api/salonapp/settings', fetcher);
  const {
    data: paymenttypes,
    isLoading: isPaymenttypesLoading,
    error: errorP,
  } = useSWR('/api/salonapp/paymenttype', fetcher);

  if (
    isserviceLoading ||
    isbranchesLoading ||
    isEmployeeLoading ||
    isAppSettingsLoading ||
    isPaymenttypesLoading ||
    iscurrentappLoading
  )
    return <div>Loading...</div>;
  if (errorS || errorB || errorE || errorI || errorP || errorC) return <div>Error Loading...</div>;

  const appdata = currentappointment.data[0];

  const Invoice_line1: Invoice_line[] = [
    {
      id: 0,
      invoice_id: 0,
      quantity: 1,
      price: appdata?.Product.price,
      employee_id: appdata?.employee_id,
      Employee: appdata?.Employee,
      product_id: appdata?.product_id,
      Product: appdata?.Product,
      discount: 0,
      branch_id: appdata.branch_id,
      Branches_organization: appdata.Branches_organization,
      deleted: 0,
    },
  ];
  appdata.Additional_products?.forEach((Additonal_product: Additional_products) => {
    const tmp = {
      id: 0,
      invoice_id: 0,
      quantity: 1,
      price: Additonal_product?.Product.price,
      employee_id: Additonal_product?.employee_id,
      Employee: Additonal_product?.Employee,
      product_id: Additonal_product?.product_id,
      Product: Additonal_product?.Product,
      branch_id: appdata.branch_id,
      discount: 0,
      deleted: 0,
      Branches_organization: appdata.Branches_organization,
    };
    Invoice_line1.push(tmp);
  });

  const currentInvoice = {
    id: '0',
    invoicenumber: '',
    date: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    tax_rate: 0,
    tip: 0,
    total: 0,
    Invstatus: {
      name: 'Pending Invoice',
    },
    customer_id: appdata?.customer_id,
    Customer: appdata.Customer,
    branch_id: appdata?.branch_id,
    Branches_organization: appdata?.Branches_organization,
    event_id: appdata?.id,
    discount: 0,
    Invoice_line: Invoice_line1,
    Event: appdata,
    status: 0,
    deleted: 0,
    Payment: [],
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.appointment.appointmentinvoice'),
            href: paths.dashboard.appointments.root,
          },
          { name: currentappointment?.data[0].id },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvoiceNewEditForm
        currentInvoice={currentInvoice}
        services={service.data}
        branches={branches.data}
        employees={employees.data}
        appsettings={appsettings.data}
        paymenttypes={paymenttypes.data}
      />
    </DashboardContent>
  );
}
