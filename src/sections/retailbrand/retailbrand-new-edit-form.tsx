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
import { Form, RHFTextField } from 'src/components/hook-form';

import { type RetailBrandItem } from 'src/types/service';

// ----------------------------------------------------------------------

interface Props {
  currentRetailbrand?: RetailBrandItem;
}

export type NewPRetailBrandSchemaType = zod.infer<typeof NewRetailBrandSchema>;
const NewRetailBrandSchema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1, { message: 'Enter valid Name' }),
  desc: zod.string().optional(),
});

export default function RetailBrandNewEditForm({ currentRetailbrand }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentRetailbrand?.id || '',
      name: currentRetailbrand?.name || '',
      desc: currentRetailbrand?.desc || '',
    }),
    [currentRetailbrand]
  );

  const methods = useForm<NewPRetailBrandSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewRetailBrandSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const productData = {
      id: Number(data.id),
      name: data.name,
      desc: data.desc,
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/retailbrand`, {
        method: currentRetailbrand ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentRetailbrand
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentRetailbrand ? t('general.update_success') : t('general.create_success')
        );

        mutate(`/api/salonapp/retailbrand/${currentRetailbrand?.id}`);
        // Retailbrandil listing again
        router.push(paths.dashboard.retailbrands.list);
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
                helperText={t('salonapp.service.sn_helper')}
              />
              <RHFTextField
                name="desc"
                label={t('general.description')}
                helperText={t('salonapp.service.desc_helper')}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentRetailbrand
                  ? t('salonapp.service.create_retailbrand')
                  : t('salonapp.service.save_retailbrand')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
