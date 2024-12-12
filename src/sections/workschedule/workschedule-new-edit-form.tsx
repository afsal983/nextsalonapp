import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import { Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { Schedule, EmployeeItem, type TimeSlotItem } from 'src/types/employee';

import WorkScheduleNewEditDetails from './workschedule-new-edit-details';

// ----------------------------------------------------------------------

type Props = {
  currentWorkSchedule: Schedule[];
  timeSlot: TimeSlotItem[];
  employee?: EmployeeItem[];
};

export type scheduleSchemaType = zod.infer<typeof scheduleSchema>;

const slotSchema = zod.object({
  id: zod.number({ required_error: 'Slot is required' }), // Required number with a custom error message
  name: zod.string({ required_error: 'Name is required' }), // Required string with a custom error message
});

// Define the day schedule schema
const dayScheduleSchema = zod.object({
  day: zod.number({ required_error: 'Day is required' }), // Required number with a custom error
  slots: zod
    .array(slotSchema, { required_error: 'Slots are required' }) // Array of slotSchema
    .min(1, { message: 'At least one slot is required' }), // Minimum one slot required
});

// Define the employee schedule schema
const employeeScheduleSchema = zod.object({
  employee_id: zod.number({ required_error: 'Employee ID is required' }), // Required number
  dayschedule: zod
    .array(dayScheduleSchema, { required_error: 'Day schedule is required' }) // Array of dayScheduleSchema
    .min(1, { message: 'At least one day schedule is required' }), // Minimum one day schedule
});

// Define the schedule schema
const scheduleSchema = zod.object({
  employeeschedule: zod
    .array(employeeScheduleSchema, { required_error: 'Employee schedule is required' })
    .min(1, { message: 'At least one employee schedule is required' }),
});

export default function WorkScheduleNewEditForm({
  currentWorkSchedule,
  timeSlot,
  employee,
}: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const loadingSend = useBoolean();

  const defaultValues = useMemo(
    () => ({
      employeeschedule: currentWorkSchedule,
    }),
    [currentWorkSchedule]
  );

  const methods = useForm<scheduleSchemaType>({
    mode: 'all',
    resolver: zodResolver(scheduleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    const result = data?.employeeschedule?.flatMap((emp) =>
      emp.dayschedule.flatMap((day) =>
        day?.slots?.map((slot) => ({
          employee_id: emp.employee_id,
          day: day.day,
          timeslotid: slot.id,
        }))
      )
    );

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/workschedule`, {
        method: currentWorkSchedule ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(currentWorkSchedule ? responseData?.message : responseData?.message);
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(
          currentWorkSchedule ? t('general.update_success') : t('general.create_success')
        );

        mutate('/api/salonapp/workschedule');
        router.push(paths.dashboard.employees.workschedule.root);
      }
    } catch (error) {
      toast.error(error);
    }
  });

  // Update the form fields when new workscheduleData arrives
  useEffect(() => {
    if (currentWorkSchedule) {
      reset({
        employeeschedule: currentWorkSchedule, // Assuming this is the data structure
      });
    }
  }, [currentWorkSchedule, reset]);

  return (
    <Form methods={methods}>
      <Card>
        <WorkScheduleNewEditDetails
          currentWorkSchedule={currentWorkSchedule}
          timeSlot={timeSlot}
          employee={employee}
        />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentWorkSchedule ? 'Update' : 'Create'} & Send
        </LoadingButton>
      </Stack>
    </Form>
  );
}
