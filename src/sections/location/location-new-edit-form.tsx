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

import { type LocationItem } from 'src/types/location';

// ----------------------------------------------------------------------

interface Props {
  currentLocation?: LocationItem;
}

export type NewLocationSchemaType = zod.infer<typeof NewLocationSchema>;
const NewLocationSchema = zod.object({
  loc_id: zod.string().optional(), // Optional string field
  name: zod.string().min(1, { message: 'salonapp.location.name_fvalid_error' }), // Required field with custom error message
  address: zod.string().optional(), // Optional string field
  telephone: zod.string().optional(), // Optional string field
  location_url: zod.string().optional(), // Optional string field
});

export default function LocationNewEditForm({ currentLocation }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      loc_id: currentLocation?.loc_id.toString() || '0',
      name: currentLocation?.name || '',
      address: currentLocation?.address || '',
      telephone: currentLocation?.telephone || '',
      location_url: currentLocation?.location_url || '',
    }),
    [currentLocation]
  );

  const methods = useForm<NewLocationSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewLocationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const LocationData = {
      loc_id: currentLocation?.loc_id,
      name: data.name,
      address: data.address,
      telephone: data.telephone,
      location_url: data.location_url,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/location`, {
        method: currentLocation ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(LocationData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentLocation
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.error(currentLocation ? t('general.update_success') : t('general.create_success'));

        mutate(`/api/salonapp/location/${currentLocation?.loc_id}`);
        // Service listing again
        router.push(paths.dashboard.location.list);
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
                label={t('salonapp.location.locname')}
                helperText={t('salonapp.location.ln_helper')}
              />
              <RHFTextField
                name="address"
                label={t('salonapp.location.address')}
                helperText={t('salonapp.location.addr_helper')}
              />
              <RHFTextField
                name="telephone"
                label={t('salonapp.location.telephone')}
                helperText={t('salonapp.location.tel_helper')}
              />
              <RHFTextField
                name="location_url"
                label={t('salonapp.location.location_url')}
                helperText={t('salonapp.location.lu_helper')}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentLocation
                  ? t('salonapp.location.create_location')
                  : t('salonapp.location.save_location')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
