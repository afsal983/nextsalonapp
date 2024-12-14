import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, RHFTextField } from 'src/components/hook-form';

import { type PaymentTypeItem } from 'src/types/paymenttype';

export type PaymentTypeSchemaType = zod.infer<typeof PaymentTypeSchema>;
const PaymentTypeSchema = zod.object({
  id: zod.string().optional(), // Optional string field
  name: zod.string({ required_error: 'Invalid Name' }), // Required string with a custom error
  description: zod.string().optional(), // Optional string field
  default_paymenttype: zod.boolean().optional(), // Optional boolean field
  is_authcode: zod.boolean().optional(), // Optional boolean field
  deleted: zod.boolean().optional(), // Optional boolean field
});
// ----------------------------------------------------------------------

interface Props {
  currentPaymentType?: PaymentTypeItem;
}

export default function PaymentTypeNewEditForm({ currentPaymentType }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentPaymentType?.id || '',
      name: currentPaymentType?.name || '',
      description: currentPaymentType?.description || '',
      default_paymenttype: currentPaymentType?.default_paymenttype || false,
      is_authcode: currentPaymentType?.is_authcode || false,
      deleted: currentPaymentType?.deleted || false,
    }),
    [currentPaymentType]
  );

  const methods = useForm<PaymentTypeSchemaType>({
    mode: 'all',
    resolver: zodResolver(PaymentTypeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const paymenttypeData = {
      id: Number(data.id),
      name: data.name,
      desc: data.description,
      default_paymenttype: data.default_paymenttype,
      is_authcode: data.is_authcode,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/paymenttype`, {
        method: currentPaymentType ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymenttypeData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentPaymentType
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentPaymentType ? t('general.update_success') : t('general.create_success')
        );

        mutate(`/api/salonapp/paymenttype/${currentPaymentType?.id}`);
        // PaymentTypeil listing again
        router.push(paths.dashboard.invoice.paymenttypes.list);
      }
    } catch (error) {
      toast.error('Error');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
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
                name="name"
                label={t('general.name')}
                helperText={t('salonapp.paymenttype.name_helper')}
              />
              <RHFTextField
                name="description"
                label={t('general.description')}
                helperText={t('salonapp.paymenttype.desc_helper')}
              />
              <RHFSwitch
                name="default_paymenttype"
                label={t('salonapp.paymenttype.default_payment')}
                helperText={t('salonapp.paymenttype.default_payment_helper')}
              />
              <RHFSwitch
                name="is_authcode"
                label={t('salonapp.paymenttype.auth_code')}
                helperText={t('salonapp.paymenttype.auth_code_helper')}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentPaymentType
                  ? t('salonapp.paymenttype.create_new_paymenttype')
                  : t('salonapp.paymenttype.save_paymenttype')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
