import { z as zod } from 'zod';
import { mutate } from 'swr';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { allLangs, useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, RHFTextField } from 'src/components/hook-form';

import { type ServiceCategoryItem } from 'src/types/service';

// ----------------------------------------------------------------------

interface Props {
  currentServiceCategory?: ServiceCategoryItem;
}
const { t } = useTranslate();
export type NewProductCategorySchemaType = zod.infer<typeof NewProductCategorySchema>;
const NewProductCategorySchema = zod.object({
  id: zod.string().optional(), // Optional string field (equivalent to Yup.string())
  name: zod.string().min(1, { message: t('salonapp.service.servicecategory.name_fvalid_error') }), // Required field with a custom error message
});

export default function ServiceCategoryNewEditForm({ currentServiceCategory }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentServiceCategory?.id || '0',
      name: currentServiceCategory?.name || '',
    }),
    [currentServiceCategory]
  );

  const methods = useForm<NewProductCategorySchemaType>({
    mode: 'all',
    resolver: zodResolver(NewProductCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const ServiceCategoryData = {
      id: Number(data.id),
      name: data.name,
      type: 1,
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/servicecategory`, {
        method: currentServiceCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ServiceCategoryData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentServiceCategory
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentServiceCategory ? t('general.update_success') : t('general.create_success')
        );

        mutate(`/api/salonapp/servicecategory/${currentServiceCategory?.id}`);
        // Service listing again
        router.push(paths.dashboard.services.servicecategory.list);
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
                name="name"
                label={t('salonapp.service.servicecategory.servicecategory_name')}
                helperText={t('salonapp.service.servicecategory.sn_helper')}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentServiceCategory
                  ? t('salonapp.service.servicecategory.create_servicecategory')
                  : t('salonapp.service.servicecategory.save_servicecategory')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
