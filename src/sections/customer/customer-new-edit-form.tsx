import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, RHFSelect, RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

import { type Customer, type CustomerCategory } from 'src/types/customer';

// ----------------------------------------------------------------------

interface Props {
  currentCustomer?: Customer;
  customercategory: CustomerCategory[];
}
export const GENDER_OPTIONS = [
  { label: 'Female', value: 0 },
  { label: 'Male', value: 1 },
  { label: 'Other', value: 2 },
];

export type NewCustomerSchemaType = zod.infer<typeof NewCustomerSchema>;

const NewCustomerSchema = zod.object({
  id: zod.string().optional(), // Optional field
  firstname: zod.string().min(1, { message: 'salonapp.customer.name_fvalid_error' }), // Required with error message
  lastname: zod.string().optional(), // Optional field
  comment: zod.string().optional(), // Optional field
  address: zod.string().optional(), // Optional field
  telephone: zod.string().min(1, { message: 'salonapp.customer.telephone_fvalid_error' }), // Required with error message
  email: zod.string().optional(), // Optional field
  sex: zod.number().optional(), // Optional field
  dob: zod.any().refine((val) => val !== undefined, { message: 'Date is required' }), // Required field
  category_id: zod.number().min(1, { message: 'salonapp.customer.category_fvalid_error' }), // Required with error message
  taxid: zod.string().optional(), // Optional field
  cardno: zod.string().optional(), // Optional field
  eventnotify: zod.boolean().optional(), // Optional field
  promonotify: zod.boolean().optional(), // Optional field
});

export default function CustomerNewEditForm({ currentCustomer, customercategory }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentCustomer?.id || '0',
      firstname: currentCustomer?.firstname || '',
      lastname: currentCustomer?.lastname || '',
      comment: currentCustomer?.comment || '',
      address: currentCustomer?.address || '',
      telephone: currentCustomer?.telephone || '',
      email: currentCustomer?.email || '',
      sex: currentCustomer?.sex || 0,
      dob: (currentCustomer?.dob && new Date(currentCustomer?.dob)) || new Date(),
      category_id: currentCustomer?.category_id || 0,
      taxid: currentCustomer?.taxid || '',
      cardno: currentCustomer?.cardno || '',
      eventnotify: currentCustomer?.CustomerPreference?.eventnotify || false,
      promonotify: currentCustomer?.CustomerPreference?.promonotify || false,
    }),
    [currentCustomer]
  );

  const methods = useForm<NewCustomerSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    let isoDateString;
    // Create a new Date object from the string
    if (data?.dob) {
      const dateObj = new Date(data?.dob);
      // Convert to ISO string with UTC time
      isoDateString = dateObj.toLocaleDateString('en-CA');
    }

    const customerData = {
      id: data.id,
      firstname: data.firstname,
      lastname: data.lastname,
      comment: data.comment,
      address: data.address,
      telephone: data.telephone,
      email: data.email,
      sex: data.sex,
      dob: isoDateString,
      category_id: data.category_id,
      taxid: data.taxid,
      cardno: data.cardno,
      CustomerPreference: {
        customer_id: data.id,
        eventnotify: data.eventnotify,
        promonotify: data.promonotify,
        dummy: false,
      },
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/customer`, {
        method: currentCustomer ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentCustomer
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentCustomer ? t('general.update_success') : t('general.create_success'));

        mutate(`/api/salonapp/customer/${currentCustomer?.id}`);
        // Customer listing again
        router.push(paths.dashboard.customers.list);
      }
    } catch (error) {
      toast.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="firstname"
                label={t('salonapp.customer.firstname')}
                helperText={t('salonapp.customer.fn_helper')}
              />
              <RHFTextField
                name="lastname"
                label={t('salonapp.customer.lastname')}
                helperText={t('salonapp.customer.ln_helper')}
              />
              <RHFTextField
                name="telephone"
                label={t('salonapp.customer.telephone')}
                helperText={t('salonapp.customer.tn_helper')}
              />
              <RHFTextField
                name="email"
                label={t('salonapp.customer.email')}
                helperText={t('salonapp.customer.em_helper')}
              />
              <RHFTextField
                name="address"
                multiline
                rows={3}
                label={t('salonapp.customer.address')}
              />
              <RHFTextField
                name="comment"
                multiline
                rows={3}
                label={t('salonapp.customer.comments')}
              />
              <RHFSelect
                native
                name="category_id"
                label={t('salonapp.customer.category')}
                InputLabelProps={{ shrink: true }}
              >
                <option key={0}>{t('general.dropdown_select')}</option>
                {customercategory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>
              <Controller
                name="dob"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    {...field}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Stack spacing={1}>
                <Typography variant="subtitle2">Sex</Typography>
                <RHFRadioGroup row spacing={4} name="sex" options={GENDER_OPTIONS} />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={10}>
                <RHFSwitch
                  name="eventnotify"
                  label={t('salonapp.customer.eventnotify')}
                  helperText={t('salonapp.customer.en_helper')}
                />
                <RHFSwitch
                  name="promonotify"
                  label={t('salonapp.customer.promonotify')}
                  helperText={t('salonapp.customer.pn_helper')}
                />
              </Stack>
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentCustomer
                  ? t('salonapp.customer.create_customer')
                  : t('salonapp.customer.save_customer')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
