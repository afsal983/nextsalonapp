import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'minimal-shared/hooks';

import { today } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFCheckbox, schemaHelper } from 'src/components/hook-form';

import { BranchItem } from 'src/types/branch';
import { ServiceItem } from 'src/types/service';
import { EmployeeItem } from 'src/types/employee';
import { AppointmentItem } from 'src/types/appointment';

import AppointmentBranchDetails from './appointment-branch-details';
import AppointmentNewEditDetails from './appointment-new-edit-details';
import AppointmentCustomerDetails from './appointment-customer-details';

// ----------------------------------------------------------------------

type Props = {
  currentAppointment?: AppointmentItem;
  services?: ServiceItem[];
  branches: BranchItem[];
  employees: EmployeeItem[];
};

export type NewAppointmentSchemaType = zod.infer<typeof AppointmentSchema>;

const AppointmentSchema = zod.object({
  id: zod.string().optional(), // Optional field
  name: zod.string().optional(), // Optional field
  start: schemaHelper.date({ message: { required: 'Create date is required!' } }),
  end: schemaHelper.date({ message: { required: 'End date is required!' } }),
  resource: zod.string().optional(), // Optional field
  customer_id: zod.number().min(1, { message: 'Customer is required' }),
  Customer: zod.any().optional(), // Optional field
  product_id: zod.number().min(1, { message: 'Service is required' }),
  Product: zod.any().optional(), // Optional field
  employee_id: zod.number().min(1, { message: 'Employee is required' }),
  Employee: zod.any().optional(), // Optional field
  branch_id: zod.number().min(1, { message: 'Branch is required' }),
  Branches_organization: zod.any().optional(), // Optional field
  Reminder_count: zod.number().optional(), // Optional field
  Additional_products: zod
    .array(
      zod.object({
        id: zod.number().optional(), // Optional field
        event_id: zod.number().optional(),
        start: schemaHelper.date({ message: { required: 'Create date is required!' } }),
        end: schemaHelper.date({ message: { required: 'End date is required!' } }),
        product_id: zod.number().min(1, { message: 'Service is required' }),
        Product: zod.any().optional(), // Optional field
        employee_id: zod.number().min(1, { message: 'Employee is required' }),
        Employee: zod.any().optional(), // Optional field
        deleted: zod.number().optional(), // Optional field
      })
    )
    .optional(), // Optional array
  notify: zod.boolean().optional(), // Optional field
});

export default function AppointmentNewEditForm({
  currentAppointment,
  services,
  branches,
  employees,
}: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  // const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const defaultValues = useMemo(
    () => ({
      id: currentAppointment?.id || '',
      name: currentAppointment?.name || '',
      start: currentAppointment?.start || today(),
      end: currentAppointment?.end || today(),
      resource: currentAppointment?.resource || '',
      customer_id: currentAppointment?.customer_id || 0,
      Customer: currentAppointment?.Customer,
      product_id: currentAppointment?.product_id || 0,
      Product: currentAppointment?.Product || {},
      employee_id: currentAppointment?.employee_id || 0,
      Employee: currentAppointment?.Employee || {},
      branch_id: currentAppointment?.branch_id || Number(branches[0]?.branch_id),
      Branches_organization: currentAppointment?.Branches_organization || branches[0],
      Reminder_count: currentAppointment?.Reminder_count || 0,
      Additional_products: currentAppointment?.Additional_products,
      is_invoiced: currentAppointment?.is_invoiced || false,
      notes: currentAppointment?.notes || '',
      type: currentAppointment?.type,
      notify: true,
    }),
    [currentAppointment, branches]
  );

  const methods = useForm<NewAppointmentSchemaType>({
    mode: 'all',
    resolver: zodResolver(AppointmentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    console.log('dddwdwdd');
    loadingSend.onTrue();

    const additional_products: any[] = [];

    data?.Additional_products?.forEach((item) => {
      const tmp = {
        id: Number(item.id) || '0',
        event_id: Number(currentAppointment?.id) || 0,
        start: item.start,
        end: item.end,
        product_id: Number(item.product_id),
        employee_id: Number(item.employee_id),
        deleted: item.deleted || 0,
      };
      additional_products.push(tmp);
    });

    const appointmentdata = {
      id: Number(currentAppointment?.id) || 0,
      start: currentAppointment?.start || data.start,
      end: currentAppointment?.end || data.end,
      customer_id: Number(currentAppointment?.customer_id) || Number(data.customer_id),
      product_id: Number(currentAppointment?.product_id) || Number(data.product_id),
      employee_id: currentAppointment?.employee_id || Number(data.employee_id),
      branch_id: Number(currentAppointment?.branch_id) || Number(data.branch_id),
      reminder_count: 0,
      Additional_products: additional_products,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/appointments?notify=${data.notify}`, {
        method: currentAppointment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentdata),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(currentAppointment ? responseData?.message : responseData?.message);
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentAppointment ? t('general.update_success') : t('general.create_success')
        );

        mutate(`/api/salonapp/appointments/${currentAppointment?.id}`);
        // List invoice after creation
        router.push(paths.dashboard.appointments.list);
      }
    } catch (error) {
      toast.error('Error');
    }
  });

  return (
    <Form methods={methods}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <AppointmentBranchDetails />
        </Grid>
        <Divider />
        <Grid size={{ xs: 12, md: 4 }}>
          <AppointmentCustomerDetails />
        </Grid>
        <Grid size={{ xs: 1, md: 1 }}>
          <Divider orientation="vertical" />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <AppointmentNewEditDetails
            services={services}
            employees={employees}
            currentAppointment={currentAppointment}
          />
        </Grid>
      </Grid>
      <Stack
        justifyContent="flex-end"
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <RHFCheckbox name="notify" label="Send Notification" />
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentAppointment ? 'Update' : 'Create'} Appointment
        </LoadingButton>
      </Stack>
    </Form>
  );
}
