import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

import { fData } from 'src/utils/format-number';
import { base64ToBlob, blobToBase64 } from 'src/utils/base64convert';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, Field, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { type AppSettings } from 'src/types/settings';

// ----------------------------------------------------------------------

interface Props {
  currentSettings: AppSettings[];
}

export type GeneralSettingsSchemaType = zod.infer<typeof GeneralSettingsSchema>;
const GeneralSettingsSchema = zod.object({
  logocontent: zod
    .any()
    .nullable()
    .refine((value) => value !== null, {
      message: 'Logo is required',
    }),
  emailid: zod.string().nonempty('Email is required').email('Email must be a valid email address'),
  adminemail: zod.string().email('Email must be a valid email address'),
  telephone: zod.string().nonempty('Phone number is required'),
  language: zod.string().nonempty('Language is required'),
  address1: zod.string().optional(),
  address2: zod.string().optional(),
  startTime: zod.string().optional(),
  endTime: zod.string().optional(),
  timeFormat: zod.string().optional(),
  timezone: zod.string().optional(),
  homepage: zod.string().optional(),
  currency: zod.string().nonempty('Currency is required'),
  theme: zod.string().optional(),
  defaulttelcode: zod.string().optional(),
  emailserver: zod.string().optional(),
});

export default function SettingsGeneral({ currentSettings }: Props) {
  const router = useRouter();
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const defaultValues = useMemo(
    () => ({
      logocontent: currentSettings.find((item) => item.name === 'logocontent')?.value || '',
      emailid: currentSettings.find((item) => item.name === 'emailid')?.value || '',
      adminemail: currentSettings.find((item) => item.name === 'adminemail')?.value || '',
      telephone: currentSettings.find((item) => item.name === 'telephone')?.value || '',
      language: currentSettings.find((item) => item.name === 'language')?.value || '',
      address1: currentSettings.find((item) => item.name === 'address1')?.value || '',
      address2: currentSettings.find((item) => item.name === 'address2')?.value || '',
      startTime: currentSettings.find((item) => item.name === 'startTime')?.value || '',
      endTime: currentSettings.find((item) => item.name === 'endTime')?.value || '',
      timeFormat: currentSettings.find((item) => item.name === 'timeFormat')?.value || '',
      timezone: currentSettings.find((item) => item.name === 'timezone')?.value || '',
      homepage: currentSettings.find((item) => item.name === 'homepage')?.value || '',
      currency: currentSettings.find((item) => item.name === 'currency')?.value || '',
      theme: currentSettings.find((item) => item.name === 'theme')?.value || '',
      defaulttelcode: currentSettings.find((item) => item.name === 'defaulttelcode')?.value || '',
      emailserver: currentSettings.find((item) => item.name === 'emailserver')?.value || '',
    }),
    [currentSettings]
  );

  const methods = useForm<GeneralSettingsSchemaType>({
    mode: 'all',
    resolver: zodResolver(GeneralSettingsSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const base64String = (await blobToBase64(data.logocontent)) || '';
    const settings: AppSettings[] = [
      { id: 1, name: 'address1', value: data.address1 },
      { id: 2, name: 'address2', value: data?.address2 },
      { id: 6, name: 'endTime', value: data.endTime },
      { id: 7, name: 'homepage', value: data.homepage },
      { id: 8, name: 'language', value: data.language },
      { id: 12, name: 'startTime', value: data.startTime },
      { id: 18, name: 'timeFormat', value: data.timeFormat },
      { id: 19, name: 'timezone', value: data.timezone },
      { id: 20, name: 'emailid', value: data.emailid },
      { id: 32, name: 'logocontent', value: base64String },
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
      toast.error('Error');
    }
  });

  const handleDropLogo = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logocontent', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  useEffect(() => {
    // Example base64 string (omit data URL prefix)
    const logoBase64 = currentSettings.find((item) => item.name === 'logocontent')?.value || '';

    let blobUrl = '';
    if (logoBase64) {
      // Extract MIME type
      const mimeType = logoBase64.split(';')[0].split(':')[1];

      // Convert base64 to Blob
      const blob = base64ToBlob(logoBase64, mimeType);

      // Create a URL for the Blob and update state
      blobUrl = URL.createObjectURL(blob);

      const file = new File([blob], 'logofilename', { type: mimeType });
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(blob),
      });

      setValue('logocontent', newFile, { shouldValidate: true });
    }

    // Clean up the Blob URL when the component unmounts
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [currentSettings, setValue]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="logocontent"
              maxSize={3145728}
              onDrop={handleDropLogo}
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

            <RHFSwitch name="isPublic" labelPlacement="start" label="Company Logo" sx={{ mt: 5 }} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
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
              <RHFTextField name="emailid" label="Email Address" />
              <RHFTextField name="adminemail" label="Admin Email Address" />
              <RHFTextField name="telephone" label="Telephone" />
              <RHFTextField name="language" label="Language" />
              <RHFTextField name="homepage" label="Home Page" />
              <RHFTextField name="address1" multiline rows={3} label="Address1" />
              <RHFTextField name="address2" multiline rows={3} label="Address2" />
              <RHFTextField name="startTime" label="Business start time" />
              <RHFTextField name="endTime" label="Business End Time" />
              <RHFTextField name="timeFormat" label="Time Format" />
              <RHFTextField name="timezone" label="Time Zone" />
              <RHFTextField name="currency" label="Currency" />
              <RHFTextField name="theme" label="Theme" />
              <RHFTextField name="defaulttelcode" label="Default Telephone code" />

              <Field.Select name="emailserver" label={t('general.product_type')}>
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem key={1} value="smtp">
                  SMTP
                </MenuItem>

                <MenuItem key={2} value="sendgrid">
                  Sendgrid
                </MenuItem>
              </Field.Select>
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
