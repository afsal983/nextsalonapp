import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { type AppSettings } from 'src/types/settings';

// ----------------------------------------------------------------------

interface Props {
  currentSettings: AppSettings[];
}

export type UpdateAppointmentSettingSchemaType = zod.infer<typeof UpdateAppointmentSettingSchema>;
const UpdateAppointmentSettingSchema = zod.object({
  calendarsPerRow: zod.string().min(1, 'Calendar Per Show is required'),
  showMonths: zod.string().min(1, 'Show Months is required'),
});

export default function SettingsAppointment({ currentSettings }: Props) {
  const router = useRouter();
  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      calendarsPerRow: currentSettings.find((item) => item.name === 'calendarsPerRow')?.value || '',
      showMonths: currentSettings.find((item) => item.name === 'showMonths')?.value || '',
    }),
    [currentSettings]
  );

  const methods = useForm<UpdateAppointmentSettingSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateAppointmentSettingSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const settings: AppSettings[] = [
      { id: 1, name: 'address1', value: data.calendarsPerRow },
      { id: 2, name: 'address2', value: data?.showMonths },
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

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    /* 
    const file = acceptedFiles[0];

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    */
  }, []);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
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
              <RHFTextField name="calendarsPerRow" label="Calndar Per Show" />
              <RHFTextField name="showMonths" label="Show Months" />
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
