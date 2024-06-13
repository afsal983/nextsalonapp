import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';

import { IInvoice } from 'src/types/invoice';
import { Employee } from 'src/types/employee';
import { ServiceItem } from 'src/types/service';
import { AppSettings } from 'src/types/settings';
import { IPaymenttypes } from 'src/types/payment';
import { Branches_organization } from 'src/types/branches_organizations';

import PaymentNewEditForm from './payment-new-edit-form'
import InvoiceNewEditDetails from './invoice-new-edit-details';
import InvoiceNewEditAddress from './invoice-new-edit-address';
import InvoiceNewEditStatusDate from './invoice-new-edit-status-date';

// ----------------------------------------------------------------------

type Props = {
  currentInvoice?: IInvoice;
  services?: ServiceItem[];
  branches: Branches_organization[];
  employees: Employee[];
  appsettings: AppSettings[];
  paymenttypes: IPaymenttypes[];
};

export default function InvoiceNewEditForm({ currentInvoice, services, branches, employees, appsettings, paymenttypes }: Props ) {
  const router = useRouter();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();  

  const NewInvoiceSchema = Yup.object().shape({
    invoiceTo: Yup.mixed<any>().nullable().required('Invoice to is required'),
    createDate: Yup.mixed<any>().nullable().required('Create date is required'),
    dueDate: Yup.mixed<any>()
      .required('Due date is required')
      .test(
        'date-min',
        'Due date must be later than create date',
        (value, { parent }) => value.getTime() > parent.createDate.getTime()
      ),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          id: Yup.number(),
          service: Yup.string().required('Service is required'),
          employee: Yup.string().required('Employee is required'),
          quantity: Yup.number()
            .required('Quantity is required')
            .min(1, 'Quantity must be more than 0'),
          price: Yup.number()
            .positive('Discount must be a positive value'),
          discount: Yup.number()
          .min(0, 'Discount cannot be negative'),
          total: Yup.number()
          .positive('Discount must be a positive value'),
        })
      )
    ),
    payments: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          id: Yup.number(),
          invoice_id: Yup.number(),
          value: Yup.number(),
          payment_type: Yup.number(),
          auth_code: Yup.string(),
        })
      )
    ),
    // not required
    taxes: Yup.number(),
    // status: Yup.string(),
    discount: Yup.number(),
    tip: Yup.number(),
    invoiceFrom: Yup.mixed(),
    totalAmount: Yup.number(),
    invoiceNumber: Yup.string(),
  });


    // Wrap the initialization of currentitems in useMemo()
    let currentitems = useMemo(() => [{
      id: 0,
      service: '',
      employee: '',
      quantity: 1,
      price: 0,
      discount: 0,
      total: 0,
  }], []);

  if( currentInvoice?.Invoice_line) {
    currentitems = []
    currentInvoice?.Invoice_line.map(item => {
        const tmp = {
          id: item.id,
          service: item.Product.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
          discount: item.discount,
          employee: item.Employee.name,
        }
        currentitems.push(tmp)
        return tmp; 
    })
  }

  const defaultValues = useMemo(
    () => ({
      invoiceTo: currentInvoice?.Customer || null,
      createDate: currentInvoice?.date || new Date(),
      dueDate: currentInvoice?.date || null,
      items: currentitems,
      payments: currentInvoice?.Payment || [
        {
          id: 0,
          invoice_id: 0,
          value: 0,
          payment_type: 0,
          auth_code: '',
        },
      ],
      taxes: currentInvoice?.tax_rate || 0,
      status: currentInvoice?.status===1? "Draft": "paid"|| 'draft',
      discount: currentInvoice?.discount || 0,
      tip : currentInvoice?.tip||0,
      invoiceFrom: currentInvoice?.Branches_organization || branches[0],
      totalAmount: currentInvoice?.total || 0,
      invoiceNumber: currentInvoice?.invoicenumber || 'INV-1990',

    }),
    [currentInvoice,branches,currentitems ]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,

    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    console.log(data)
    return
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  const renderPayment = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
    <Card>
      <CardHeader
        title="Payment"
        action={
          <IconButton> 
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          Phone number
        </Box>

        {0}
        <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} />
      </Stack>
      </Card>
    </Stack>
    
  );



  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress branches={branches}/>

        <InvoiceNewEditStatusDate />

        <InvoiceNewEditDetails services={services} employees={employees} appsettings={appsettings} currentInvoice={currentInvoice} branches={branches}/>
      
        <PaymentNewEditForm paymenttypes={paymenttypes}/>
      </Card>
    
     
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentInvoice ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
