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

import { type CustomerCategory } from 'src/types/customer';

// ----------------------------------------------------------------------

interface Props {
  currentCustomerCategory?: CustomerCategory;
}
export type NewCustomerCategorySchemaType = zod.infer<typeof NewCustomerCategorySchema>;

const NewCustomerCategorySchema = zod.object({
  id: zod.string().optional(), // Optional field
  name: zod.string().min(1, { message: 'Invalid Name' }), // Required with error message
  discount: zod.number(),
  default_category: zod.boolean().optional(), // Optional field
});

export default function CustomerCategoryNewEditForm({ currentCustomerCategory }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentCustomerCategory?.id.toString() || '0',
      name: currentCustomerCategory?.name || '',
      discount: currentCustomerCategory?.discount || 0,
      default_category: currentCustomerCategory?.default_category || false,
    }),
    [currentCustomerCategory]
  );

  const methods = useForm<NewCustomerCategorySchemaType>({
    mode: 'all',
    resolver: zodResolver(NewCustomerCategorySchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const CustomerCategoryData = {
      id: Number(data.id),
      name: data.name,
      discount: data.discount,
      default_category: data.default_category,
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/customercategory`, {
        method: currentCustomerCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(CustomerCategoryData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentCustomerCategory
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentCustomerCategory ? t('general.update_success') : t('general.create_success')
        );

        mutate(`/api/salonapp/customercategory/${currentCustomerCategory?.id}`);
        // Customer listing again
        router.push(paths.dashboard.customers.customercategory.list);
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
                label={t('salonapp.customer.customercategory.customercategory_name')}
                helperText={t('salonapp.customer.customercategory.cn_helper')}
              />
              <RHFTextField
                name="discount"
                type="number"
                label={t('salonapp.customer.customercategory.customercategory_discount')}
                helperText={t('salonapp.customer.customercategory.cdiscount_helper')}
              />
              <RHFSwitch
                name="default_category"
                label={t('salonapp.customer.customercategory.default_category')}
                helperText={t('salonapp.customer.customercategory.default_cc_helper')}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentCustomerCategory
                  ? t('salonapp.customer.customercategory.create_customercategory')
                  : t('salonapp.customer.customercategory.save_customercategory')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
