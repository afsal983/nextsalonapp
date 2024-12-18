import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'minimal-shared/hooks';

import { today } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import { BranchItem } from 'src/types/branch';
import { ServiceItem } from 'src/types/service';
import { AppSettings } from 'src/types/settings';
import { EmployeeItem } from 'src/types/employee';
import { IPaymenttypes } from 'src/types/payment';
import { Retails, IInvoice, Products, Packages, Payments } from 'src/types/invoice';

import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditAddress from './invoice-new-edit-address';
import { InvoiceNewEditStatusDate } from './invoice-new-edit-status-date';

// ----------------------------------------------------------------------

type Props = {
  currentInvoice?: IInvoice;
  services?: ServiceItem[];
  branches: BranchItem[];
  employees: EmployeeItem[];
  appsettings: AppSettings[];
  paymenttypes: IPaymenttypes[];
};

export type NewInvoiceSchemaType = zod.infer<typeof InvoiceSchema>;

// Same as database structure
const InvoiceSchema = zod.object({
  id: zod.string().optional(),
  invoicenumber: zod.string().optional(),
  date: zod.any().refine((value) => value !== undefined, { message: 'Date is required' }),
  dueDate: zod.any().optional(),
  total: zod.number().optional(),
  discount: zod.number().optional(),
  tax_rate: zod.number().optional(),
  tip: zod.number().optional(),
  customer_id: zod
    .number()
    .positive('Customer required')
    .refine((value) => value !== undefined, { message: 'Customer required' }),
  Customer: zod.any().optional(),
  event_id: zod.number().optional(),
  Event: zod.any().optional(),
  Invoice_line: zod
    .array(
      zod.object({
        id: zod.number().optional(),
        quantity: zod
          .number()
          .min(1, 'Quantity must be more than 0')
          .refine((value) => value !== undefined, { message: 'Quantity is required' }),
        price: zod
          .number()
          .positive('Price must be a positive value')
          .refine((value) => value !== undefined, { message: 'Price is required' }),
        discount: zod.number().min(0, 'Discount cannot be negative').optional(),
        invoice_id: zod.number().optional(),
        product_id: zod
          .number()
          .refine((value) => value !== undefined, { message: 'Product is required' }),
        Product: zod.any().optional(),
        employee_id: zod
          .number()
          .refine((value) => value !== undefined, { message: 'Employee is required' }),
        Employee: zod.any().optional(),
        branch_id: zod.number().optional(),
        Branches_organization: zod.any().optional(),
        deleted: zod.number().optional(),
      })
    )
    .refine((arr) => arr && arr.length > 0, { message: 'At least One item Required' })
    .optional(),
  branch_id: zod
    .number()
    .positive('Branch required')
    .refine((value) => value !== undefined, { message: 'Branch required' }),
  Branches_organization: zod.any().optional(),
  status: zod.number().refine((value) => value !== undefined, { message: 'Status required' }),
  Invstatus: zod.any().optional(),
  deleted: zod.number().optional(),
  Payment: zod
    .array(
      zod.object({
        id: zod.number().optional(),
        invoice_id: zod.number().optional(),
        value: zod
          .number()
          .positive('Payment value must be a positive value')
          .refine((value) => value !== undefined, { message: 'Payment amount is required' }),
        payment_type: zod.number().positive('Payment type required').optional(),
        auth_code: zod.string().optional(),
      })
    )
    .refine((arr) => arr && arr.length > 0, { message: 'At least One Payment Required' })
    .optional(),
});

export default function InvoiceNewEditForm({
  currentInvoice,
  services,
  branches,
  employees,
  appsettings,
  paymenttypes,
}: Props) {
  const router = useRouter();

  const currency = localStorage.getItem('___currency');

  const { t } = useTranslate();

  // const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const defaultValues = useMemo(
    () => ({
      id: currentInvoice?.id.toString() || '',
      invoicenumber: currentInvoice?.invoicenumber || '',
      date: currentInvoice?.date || today(),
      total: currentInvoice?.total || 0,
      dueDate: today(),
      discount: currentInvoice?.discount || 0,
      tax_rate: currentInvoice?.tax_rate || 0,
      tip: currentInvoice?.tip || 0,
      customer_id: currentInvoice?.customer_id || 0,
      Customer: currentInvoice?.Customer || {},
      event_id: currentInvoice?.event_id || 0,
      Event: currentInvoice?.Event || {},
      Invoice_line: currentInvoice?.Invoice_line || [],
      branch_id: currentInvoice?.branch_id || Number(branches[0].branch_id),
      Branches_organization: currentInvoice?.Branches_organization || branches[0],
      status: currentInvoice?.status || 1,
      Invstatus: currentInvoice?.Invstatus || {},
      deleted: currentInvoice?.deleted || 0,
      Payment: currentInvoice?.Payment || [],
    }),
    [currentInvoice, branches]
  );

  const methods = useForm<NewInvoiceSchemaType>({
    mode: 'all',
    resolver: zodResolver(InvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /*
  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.invoice.root);
      // console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });
  */

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    const products: Products[] = [];
    const retails: Retails[] = [];
    const packages: Packages[] = [];
    const payments: Payments[] = [];
    data?.Invoice_line?.forEach((item) => {
      if (item.Product.type === 1) {
        const tmp = {
          id: item.id,
          start: new Date(),
          end: new Date(),
          productid: item.product_id,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee_id,
          deleted: item?.deleted,
        };
        products.push(tmp);
      } else if (item.Product.type === 2) {
        const tmp = {
          id: item.id,
          productid: item.product_id,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee_id,
          deleted: item.deleted,
        };
        retails.push(tmp);
      } else if (item.Product.type === 3) {
        const tmp = {
          id: item.id,
          start: new Date(),
          end: new Date(),
          productid: item.product_id,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee_id,
          deleted: item.deleted,
        };
        packages.push(tmp);
      }
    });

    data?.Payment?.forEach((item) => {
      if (item?.value && item?.value > 0) {
        const tmp = {
          id: item.id,
          invoice_id: 0,
          value: item.value,
          payment_type: item.payment_type,
          auth_code: item.auth_code,
        };
        payments.push(tmp);
      }
    });

    const invoicedata = {
      id: currentInvoice?.id || 0,
      customer: currentInvoice?.customer_id || data.customer_id,
      branch_id: Number(currentInvoice?.branch_id) || Number(data.branch_id),
      reminder_count: 0,
      products,
      retails,
      packages,
      payments,
      discount: data.discount,
      tip: data.tip,
      paymentmethod: 1,
      notify: 0,
      createevent: 0,
      event_id: currentInvoice?.event_id || 0,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/invoice`, {
        method: currentInvoice && currentInvoice.id !== '0' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoicedata),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentInvoice && currentInvoice.id !== '0'
            ? responseData?.message
            : responseData?.message
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentInvoice && currentInvoice.id !== '0'
            ? t('general.update_success')
            : t('general.create_success')
        );

        mutate(`/api/salonapp/invoice/${currentInvoice?.id}`);
        // Invoice data after creation
        router.push(paths.dashboard.invoice.details(responseData.data[0].id));
      }
    } catch (error) {
      toast.error('Error');
    }
  });

  return (
    <Form methods={methods}>
      <Card>
        <InvoiceNewEditAddress branches={branches} />

        <InvoiceNewEditStatusDate />

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <InvoiceNewEditDetails
              services={services}
              employees={employees}
              appsettings={appsettings}
              currentInvoice={currentInvoice}
              paymenttypes={paymenttypes}
              branches={branches}
              currency={currency}
            />
          </Grid>
        </Grid>
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        {/*
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton>
      */}

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentInvoice && currentInvoice.id !== '0' ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </Form>
  );
}
