import * as Yup from "yup";
import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogActions from "@mui/material/DialogActions";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

import { useBoolean } from "src/hooks/use-boolean";

import uuidv4 from "src/utils/uuidv4";
import { isAfter, fTimestamp } from "src/utils/format-time";

import { useTranslate } from "src/locales";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "src/app/api/salonapp/appointments/calendar";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import { ColorPicker } from "src/components/color-utils";
import { LiveCustomerSearch } from "src/components/livecustomersearch";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from "src/components/hook-form";

import { Customer } from "src/types/customer";
import { ServiceItem } from "src/types/service";
import { EmployeeItem } from "src/types/employee";
import { ICalendarDate, ICalendarEvent } from "src/types/calendar";

import AddressNewForm from "../../customeraddress/address-new-form";
// ----------------------------------------------------------------------

type Props = {
  colorOptions: string[];
  onClose: VoidFunction;
  currentEvent?: ICalendarEvent;
  SelectedCustomer: Customer | null;
  Product: ServiceItem | null;
  customer_id: number;
  services: ServiceItem[];
  employees: EmployeeItem[];
  employee: string;
  appFilters: {
    employeeId: number;
    startDate: Date | null;
    endDate: Date | null;
  };
};

export default function CalendarForm({
  currentEvent,
  colorOptions,
  onClose,
  customer_id,
  employees,
  services,
  SelectedCustomer,
  Product,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const to = useBoolean();

  const { t } = useTranslate();

  const [customer, setCustomer] = useState<Customer | null>(SelectedCustomer);

  const EventSchema = Yup.object().shape({
    notes: Yup.string().max(5000, "Notes must be at most 5000 characters"),
    // not required
    color: Yup.string(),
    allDay: Yup.boolean(),
    customer_id: Yup.number(),
    employee_id: Yup.number(),
    service_id: Yup.number(),
    start: Yup.mixed(),
    end: Yup.mixed(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: currentEvent,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dateError = isAfter(values.start, values.end);

  // handle customer
  const handleSelectCustomer = useCallback(
    (value: Customer | null) => {
      // onFilters("filtervalue", typeof value === undefined ? "" : value);
      setValue("customer_id", Number(value?.id));
      // setValue("Customer", value);
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    // Convert the data into appoitment format
    const eventData: ICalendarEvent = {
      customer_id: Number(customer?.id),
      Customer: customer,
      employee_id: data.employee_id,
      service_id: data.service_id,
      Product,
      id: currentEvent?.id ? currentEvent?.id : uuidv4(),
      color: data?.color,
      notes: data?.notes,
      allDay: data?.allDay,
      end: data?.end,
      start: data?.start,
    } as ICalendarEvent;

    try {
      if (!dateError) {
        if (currentEvent?.id) {
          const responseData = await updateEvent(eventData);
          console.log("Here");
          if (responseData?.status < 300) {
            enqueueSnackbar("Appointment Updated Sucessfully!");
          } else {
            enqueueSnackbar(
              currentEvent
                ? `${t("general.update_failed")}:${responseData?.message}`
                : `${t("general.create_failed")}:${responseData.message}`,
              { variant: "error" }
            );
          }
        } else {
          const responseData = await createEvent(eventData);
          if (responseData.status < 300) {
            enqueueSnackbar("Appointment Created Sucessfully!");
          } else {
            enqueueSnackbar(
              currentEvent
                ? `${t("general.update_failed")}:${responseData.message}`
                : `${t("general.create_failed")}:${responseData.message}`,
              { variant: "error" }
            );
          }
        }
        onClose();
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  });

  const onDelete = useCallback(async () => {
    try {
      const responseData = await deleteEvent(`${currentEvent?.id}`);
      console.log(responseData);
      if (responseData?.status < 300) {
        enqueueSnackbar("Appointment Deleted Sucessfully!");
      } else {
        enqueueSnackbar(
          `${t("general.delete_failed")}:${responseData.message}`,
          { variant: "error" }
        );
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [currentEvent?.id, enqueueSnackbar, onClose, t]);

  const handleCreateCustomer = useCallback(
    async (customerInfo: Customer) => {
      console.log(customerInfo);

      try {
        // Post the data
        const response = await fetch(`/api/salonapp/customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customerInfo),
        });

        const responseData = await response.json();

        if (responseData?.status > 401) {
          enqueueSnackbar("Create Failed", { variant: "error" });
        } else {
          // Keep 500ms delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          // reset();
          enqueueSnackbar("Create Suucess", { variant: "success" });
          to.onFalse();
        }
      } catch (error) {
        enqueueSnackbar(error, { variant: "error" });
      }
    },
    [to, enqueueSnackbar]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3, my: 3 }}>
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <IconButton
            onClick={to.onTrue}
            edge="start"
            sx={{
              position: "absolute",
              top: -40, // Adjust the top position as needed
              right: 1, // Align to the right edge
            }}
          >
            <Iconify
              icon={customer_id ? "solar:pen-bold" : "mingcute:add-line"}
              onClick={to.onTrue}
            />
          </IconButton>
          <LiveCustomerSearch
            name="customer_id"
            type="customer"
            label="Search Customer..."
            placeholder="Choose a country"
            handleSelectedCustomer={handleSelectCustomer}
            fullWidth
            options={[]}
            getOptionLabel={(option) => option}
          />
        </Box>

        <RHFSelect
          native
          name="employee_id"
          label="Employee"
          InputLabelProps={{ shrink: true }}
        >
          <option key={0}>{t("general.dropdown_select")}</option>
          {employees.map((item: EmployeeItem) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </RHFSelect>

        <RHFSelect
          native
          name="service_id"
          label="Service"
          InputLabelProps={{ shrink: true }}
        >
          <option key={0}>{t("general.dropdown_select")}</option>
          {services.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </RHFSelect>

        <RHFTextField name="notes" label="Notes" multiline rows={3} />

        <RHFSwitch name="allDay" label="All day" />

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="Start date"
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              value={new Date(field.value as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="End date"
              format="dd/MM/yyyy hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: dateError,
                  helperText:
                    dateError && "End date must be later than start date",
                },
              }}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ColorPicker
              selected={field.value as string}
              onSelectColor={(color) => field.onChange(color as string)}
              colors={colorOptions}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {!!currentEvent?.id && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={dateError}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
      <AddressNewForm
        open={to.value}
        onClose={to.onFalse}
        onCreate={handleCreateCustomer}
      />
    </FormProvider>
  );
}
