import { mutate } from 'swr';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFTextField } from 'src/components/hook-form';

import { type OrganizationItem } from 'src/types/organization';

// ----------------------------------------------------------------------

interface Props {
  currentOrganization?: OrganizationItem;
}

export default function OrganizationNewEditForm({ currentOrganization }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    org_id: Yup.string(),
    name: Yup.string().required(t('salonapp.organization.name_fvalid_error')),
    address: Yup.string().required(t('salonapp.organization.addr_fvalid_error')),
    telephone: Yup.string().required(t('salonapp.organization.telephone_fvalid_error')),
    email: Yup.string().required(t('salonapp.organization.email_fvalid_error')),
  });

  const defaultValues = useMemo(
    () => ({
      org_id: currentOrganization?.org_id || '0',
      name: currentOrganization?.name || '',
      address: currentOrganization?.address || '',
      telephone: currentOrganization?.telephone || '',
      email: currentOrganization?.email || '',
    }),
    [currentOrganization]
  );

  console.log(defaultValues);
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const OrganizationData = {
      org_id: currentOrganization?.org_id,
      name: data.name,
      address: data.address,
      telephone: data.telephone,
      email: data.email,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/organization`, {
        method: currentOrganization ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(OrganizationData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentOrganization
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentOrganization ? t('general.update_success') : t('general.create_success')
        );

        mutate(`/api/salonapp/organization/${currentOrganization?.org_id}`);
        // Service listing again
        router.push(paths.dashboard.organization.list);
      }
    } catch (error) {
      toast.error(error);
    }
  });

  return (
    <Form methods={methods}>
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
                label={t('salonapp.organization.name')}
                helperText={t('salonapp.organization.on_helper')}
              />
              <RHFTextField
                name="address"
                label={t('salonapp.organization.addr')}
                helperText={t('salonapp.organization.addr_helper')}
              />
              <RHFTextField
                name="telephone"
                label={t('salonapp.organization.telephone')}
                helperText={t('salonapp.organization.tel_helper')}
              />
              <RHFTextField
                name="email"
                label={t('salonapp.organization.email')}
                helperText={t('salonapp.organization.em_helper')}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentOrganization
                  ? t('salonapp.organization.create_organization')
                  : t('salonapp.organization.save_organization')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
