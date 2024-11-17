import * as Yup from "yup";
import { mutate } from "swr";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useBoolean } from "src/hooks/use-boolean";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Divider } from "@mui/material";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { fData } from "src/utils/format-number";
import { base64ToBlob, blobToBase64 } from "src/utils/base64convert";

import { useTranslate } from "src/locales";

import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "src/components/hook-form";

import { BranchItem } from "src/types/branch";
import { EmployeeItem } from "src/types/employee";

import { AppointmentItem } from "src/types/appointment";
import { ServiceItem } from "src/types/service";
import AppointmentNewEditDetails from "./appointment-new-edit-details";
import AppointmentCustomerDetails from "./appointment-customer-details";
import AppointmentBranchDetails from "./appointment-branch-details";

// ----------------------------------------------------------------------

type Props = {
  currentAppointment?: AppointmentItem;
  services?: ServiceItem[];
  branches: BranchItem[];
  employees: EmployeeItem[];
};

export default function AppointmentNewEditForm({
  currentAppointment,
  services,
  branches,
  employees,
}: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  // const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  // Same as database structure
  const AppointmentSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string(),
    start: Yup.mixed<any>().required("Start Date is required"),
    end: Yup.mixed<any>().required("End Date is required"),
    resource: Yup.string(),
    customer_id: Yup.string().min(1, "Customer is required"),
    Customer: Yup.mixed<any>(),
    product_id: Yup.string().min(1, "Service is required"),
    Product: Yup.mixed<any>(),
    employee_id: Yup.string().min(1, "Employee is required"),
    Employee: Yup.mixed<any>(),
    branch_id: Yup.string().min(1, "Branch is required"),
    Branches_organization: Yup.mixed<any>(),
    Reminder_count: Yup.number(),
    Additional_products: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          id: Yup.string(),
          event_id: Yup.number(),
          start: Yup.mixed<any>().required("Start Date is required"),
          end: Yup.mixed<any>().required("End Date is required"),
          product_id: Yup.number()
            .min(1, "Service is required")
            .required("Service is required"),
          employee_id: Yup.number()
            .min(1, "Employee is required")
            .required("Employee is required"),
          deleted: Yup.number(),
        })
      )
    ),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentAppointment?.id || "",
      name: currentAppointment?.name || "",
      start: currentAppointment?.start && new Date(currentAppointment?.start),
      end: currentAppointment?.end && new Date(currentAppointment?.end),
      resource: currentAppointment?.resource || "",
      customer_id: currentAppointment?.customer_id || "",
      Customer: currentAppointment?.Customer,
      product_id: currentAppointment?.product_id || "",
      Product: currentAppointment?.Customer || {},
      employee_id: currentAppointment?.employee_id || "",
      Employee: currentAppointment?.Employee || {},
      branch_id: currentAppointment?.branch_id || branches[0]?.branch_id,
      Branches_organization:
        currentAppointment?.Branches_organization || branches[0],
      Reminder_count: currentAppointment?.Reminder_count || 0,
      Additional_products: currentAppointment?.Additional_products,
      is_invoiced: currentAppointment?.is_invoiced || false,
      notes: currentAppointment?.notes || "",
      type: currentAppointment?.type,
    }),
    [currentAppointment, branches]
  );

  const methods = useForm({
    resolver: yupResolver(AppointmentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    const additional_products: any[] = [];

    data?.Additional_products?.forEach((item) => {
      const tmp = {
        id: Number(item.id) || "0",
        event_id: Number(currentAppointment?.id) || 0,
        start: new Date(item.start),
        end: new Date(item.end),
        product_id: Number(item.product_id),
        employee_id: Number(item.employee_id),
        deleted: item.deleted || 0,
      };
      additional_products.push(tmp);
    });

    const appointmentdata = {
      id: Number(currentAppointment?.id) || 0,
      start: currentAppointment?.start || new Date(data.start),
      end: currentAppointment?.end || new Date(data.end),
      customer_id:
        Number(currentAppointment?.customer_id) || Number(data.customer_id),
      product_id:
        Number(currentAppointment?.product_id) || Number(data.product_id),
      employee_id: currentAppointment?.employee_id || Number(data.employee_id),
      branch_id:
        Number(currentAppointment?.branch_id) || Number(data.branch_id),
      reminder_count: 0,
      Additional_products: additional_products,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/appointments`, {
        method: currentAppointment ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentdata),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(
          currentAppointment ? responseData?.message : responseData?.message,
          { variant: "error" }
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(
          currentAppointment
            ? t("general.update_success")
            : t("general.create_success"),
          { variant: "success" }
        );

        mutate(`/api/salonapp/appointments/${currentAppointment?.id}`);
        // List invoice after creation
        router.push(paths.dashboard.appointments.list);
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  });

  console.log("sssss");

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppointmentBranchDetails />
        </Grid>
        <Divider />
        <Grid xs={12} md={4}>
          <AppointmentCustomerDetails />
        </Grid>
        <Grid xs={1} md={1}>
          <Divider orientation="vertical" />
        </Grid>
        <Grid xs={12} md={7}>
          <AppointmentNewEditDetails
            services={services}
            employees={employees}
            currentAppointment={currentAppointment}
          />
        </Grid>
      </Grid>
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
          {currentAppointment ? "Update" : "Create"} Appointment
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
