import * as Yup from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { useTranslate } from "src/locales";

import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";

import { Schedule, EmployeeItem, type TimeSlotItem } from "src/types/employee";

import WorkScheduleNewEditDetails from "./workschedule-new-edit-details";

// ----------------------------------------------------------------------

type Props = {
  currentWorkSchedule: Schedule[];
  timeSlot: TimeSlotItem[];
  employee?: EmployeeItem[];
};

export default function WorkScheduleNewEditForm({
  currentWorkSchedule,
  timeSlot,
  employee,
}: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const loadingSend = useBoolean();

  // Define the schema for each slot
  const slotSchema = Yup.object().shape({
    id: Yup.number().required("Slot is required"),
    name: Yup.string().required("Name is required"),
  });

  // Define the schema for each day schedule
  const dayScheduleSchema = Yup.object().shape({
    day: Yup.number().required("Day is required"),
    slots: Yup.array()
      .of(slotSchema)
      .required("Slots are required")
      .min(1, "At least one slot is required"),
  });

  // Define the schema for the entire object
  const employeeScheduleSchema = Yup.object().shape({
    employee_id: Yup.number().required("Employee ID is required"),
    dayschedule: Yup.array()
      .of(dayScheduleSchema)
      .required("Day schedule is required")
      .min(1, "At least one day schedule is required"),
  });

  const schedule = Yup.object().shape({
    employeeschedule: Yup.array()
      .of(employeeScheduleSchema)
      .required("Slots are required")
      .min(1, "At least one slot is required"),
  });

  const defaultValues = useMemo(
    () => ({
      employeeschedule: currentWorkSchedule,
    }),
    [currentWorkSchedule]
  );

  const methods = useForm({
    resolver: yupResolver(schedule),
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
      emp.dayschedule.flatMap(
        (day) =>
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
        method: currentWorkSchedule ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(
          currentWorkSchedule ? responseData?.message : responseData?.message,
          { variant: "error" }
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(
          currentWorkSchedule
            ? t("general.update_success")
            : t("general.create_success"),
          { variant: "success" }
        );

        // Service listing again
        router.push(paths.dashboard.employees.workschedule.root);
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  });

  return (
    <FormProvider methods={methods}>
      <Card>
        <WorkScheduleNewEditDetails
          currentWorkSchedule={currentWorkSchedule}
          timeSlot={timeSlot}
          employee={employee}
        />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentWorkSchedule ? "Update" : "Create"} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
