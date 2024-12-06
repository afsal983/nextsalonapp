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
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFTextField } from 'src/components/hook-form';

import { type TimeSlotItem } from 'src/types/employee';

// ----------------------------------------------------------------------

interface Props {
  currentTimeSlot?: TimeSlotItem;
}
const { t } = useTranslate();
export type NewTimeSlotSchemaType = zod.infer<typeof NewTimeSlotSchema>;

const NewTimeSlotSchema = zod.object({
  id: zod.string().optional(), // Optional field
  name: zod.string().nonempty({ message: t('salonapp.service.timeslot.name_fvalid_error') }), // Required with custom error message
  desc: zod.string().optional(), // Optional field
  starttime: zod.date().optional(), // Optional date field
  endtime: zod.date().optional(), // Optional date field
});

export default function TimeSlotNewEditForm({ currentTimeSlot }: Props) {
  const router = useRouter();

  const timeStringToDate = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(0);
    return date;
  };

  const defaultValues = useMemo(
    () => ({
      id: currentTimeSlot?.id || '0',
      name: currentTimeSlot?.name || '',
      desc: currentTimeSlot?.desc || '',
      starttime:
        (currentTimeSlot?.starttime && timeStringToDate(currentTimeSlot?.starttime)) || new Date(),
      endtime: new Date('2022-04-17T17:00'),
    }),
    [currentTimeSlot]
  );

  const methods = useForm<NewTimeSlotSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewTimeSlotSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const TimeSlotData = {
      id: Number(data.id),
      name: data.name,
      desc: data.desc,
      starttime: `${data.starttime?.getHours()}:${data.starttime?.getMinutes()}`,
      endtime: `${data.endtime?.getHours()}:${data.endtime?.getMinutes()}`,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/timeslot`, {
        method: currentTimeSlot ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(TimeSlotData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentTimeSlot
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentTimeSlot ? t('general.update_success') : t('general.create_success'));

        mutate(`/api/salonapp/timeslot/${currentTimeSlot?.id}`);
        // Service listing again
        router.push(paths.dashboard.employees.timeslots.list);
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
                label={t('salonapp.timeslot.timeslot_name')}
                helperText={t('salonapp.timeslot.tn_helper')}
              />
              <RHFTextField
                name="desc"
                label={t('salonapp.timeslot.desc')}
                helperText={t('salonapp.timeslot.desc_helper')}
              />
              <MobileTimePicker name="starttime" label={t('salonapp.timeslot.starttime')} />
              <MobileTimePicker name="endtime" label={t('salonapp.timeslot.endtime')} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentTimeSlot
                  ? t('salonapp.timeslot.create_timeslot')
                  : t('salonapp.timeslot.save_timeslot')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
