import { useForm } from 'react-hook-form';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import { base64ToBlob, blobToBase64 } from 'src/utils/base64convert';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { type AppSettings } from 'src/types/settings';

// ----------------------------------------------------------------------

interface Props {
  currentSettings: AppSettings[];
}

export default function SettingsInvoice({ currentSettings }: Props) {
  const router = useRouter();
  const { t } = useTranslate();

  const UpdateUserSchema = Yup.object().shape({
    taxId: Yup.string().required('Tax ID is required'),
    taxName: Yup.string().required('Tax ID is required'),
    taxValue: Yup.string().required('Tax % is required'),
    walkin: Yup.string().required('Tax % is required'),
    poslogocontent: Yup.mixed<any>().nullable().required('Pos Logo is required'),
    seal: Yup.mixed<any>().nullable().required('Seal is required'),
    invoiceprefix: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      taxId: currentSettings.find((item) => item.name === 'taxId')?.value || '',
      taxName: currentSettings.find((item) => item.name === 'taxName')?.value || '',
      taxValue: currentSettings.find((item) => item.name === 'taxValue')?.value || '',
      walkin: currentSettings.find((item) => item.name === 'walkin')?.value || '',
      poslogocontent: currentSettings.find((item) => item.name === 'poslogocontent')?.value || '',
      seal: currentSettings.find((item) => item.name === 'sealcontent')?.value || '',
      invoiceprefix: currentSettings.find((item) => item.name === 'invoiceprefix')?.value || '',
    }),
    [currentSettings]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const poslogobase64String = (await blobToBase64(data.poslogocontent)) || '';
    const sealbase64String = (await blobToBase64(data.seal)) || '';

    const settings: AppSettings[] = [
      { id: 1, name: 'taxId', value: data.taxId },
      { id: 2, name: 'taxName', value: data?.taxName },
      { id: 4, name: 'taxValue', value: data.taxValue },
      { id: 6, name: 'walkin', value: data.walkin },
      { id: 34, name: 'poslogocontent', value: poslogobase64String },
      { id: 31, name: 'sealcontent', value: sealbase64String },
    ];
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(responseData?.message);
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(t('general.update_success'));

        // Service listing again
        router.push(paths.dashboard.settings.root);
      }
    } catch (error) {
      toast.error(error);
    }
  });

  const handleDropPosLogo = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('poslogocontent', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleDropSeal = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('seal', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  useEffect(() => {
    // Example base64 string (omit data URL prefix)
    const poslogoconetntBase64 =
      currentSettings.find((item) => item.name === 'poslogocontent')?.value || '';
    const poslogologofilename =
      currentSettings.find((item) => item.name === 'poslogofile')?.value || '';

    const sealBase64 = currentSettings.find((item) => item.name === 'sealcontent')?.value || '';
    const sealfilename = currentSettings.find((item) => item.name === 'seal')?.value || '';

    let blobUrl = '';
    let sealblobUrl = '';
    if (poslogoconetntBase64) {
      // Extract MIME type
      const mimeType = poslogoconetntBase64.split(';')[0].split(':')[1];

      // Convert base64 to Blob
      const blob = base64ToBlob(poslogoconetntBase64, mimeType);

      // Create a URL for the Blob and update state
      blobUrl = URL.createObjectURL(blob);

      const file = new File([blob], 'poslogocontent', { type: mimeType });
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(blob),
      });

      setValue('poslogocontent', newFile, { shouldValidate: true });
    }

    if (sealBase64) {
      // Extract MIME type
      const mimeType = sealBase64.split(';')[0].split(':')[1];

      // Convert base64 to Blob
      const blob = base64ToBlob(sealBase64, mimeType);

      // Create a URL for the Blob and update state
      sealblobUrl = URL.createObjectURL(blob);

      const file = new File([blob], 'seal', { type: mimeType });
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(blob),
      });

      setValue('seal', newFile, { shouldValidate: true });
    }

    // Clean up the Blob URL when the component unmounts
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      if (sealblobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [currentSettings, setValue]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete User
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
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
                size="small"
                type="number"
                name="id"
                label="Type"
                placeholder="0"
                style={{ display: 'none' }}
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField name="taxId" label="TAX Identification number" />
              <RHFTextField name="taxName" label="Tax name" />
              <RHFTextField name="taxValue" label="Tax %" />
              <RHFTextField name="walkin" label="Default Customer ID" />
              <RHFTextField name="invoiceprefix" label="Invoice prefix" />
              <RHFUploadAvatar
                name="poslogocontent"
                maxSize={3145728}
                onDrop={handleDropPosLogo}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    <h3>Salon Black and White Logo for POS</h3>
                    <br /> Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />

              <RHFUploadAvatar
                name="seal"
                maxSize={3145728}
                onDrop={handleDropSeal}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    <h3>Salon Seal</h3>
                    <br /> Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
