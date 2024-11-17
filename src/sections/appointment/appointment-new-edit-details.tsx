import { useCallback } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { useResponsive } from "src/hooks/use-responsive";
import { fTimestamp } from "src/utils/format-time";
import Iconify from "src/components/iconify";
import { RHFSelect } from "src/components/hook-form";

import { ServiceItem } from "src/types/service";
import { EmployeeItem } from "src/types/employee";
import { AppointmentDate, AppointmentItem } from "src/types/appointment";
// ----------------------------------------------------------------------

type Props = {
  services?: ServiceItem[];
  employees: EmployeeItem[];
  currentAppointment?: AppointmentItem;
};

export default function AppointmentNewEditDetails({
  services,
  employees,
  currentAppointment,
}: Props) {
  const { control, setValue, getValues, watch, resetField } = useFormContext();

  const mdUp = useResponsive("up", "md");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Additional_products",
  });

  const values = watch();

  // const dateError = isAfter(filters.startDate, filters.endDate);
  const dateError = false;

  const handleAdd = () => {
    append({
      id: 0,
      event_id: 0,
      product_id: "",
      employee_id: "",
      start: "",
      end: "",
      deleted: 0,
    });
  };

  const handleRemove = (index: number) => {
    const id = getValues(`Additional_products[${index}].id`);

    // Dont Actually delete the item. Just set deleted = 1 nad list deleted = 0 for existing items
    if (id !== 0) {
      setValue(`Additional_products[${index}].deleted`, 1);
    } else {
      // Dont care.. just delete
      remove(index);
    }
  };

  const handleClearService = useCallback(
    (index: number) => {
      resetField(`Additional_products[${index}].start`);
      resetField(`Additional_products[${index}].end`);
      resetField(`Additional_products[${index}].employee`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index: number, service: ServiceItem) => {
      if (index === -1) {
        setValue(`Product`, service);
        const start = getValues(`start`);
        setValue(`end`, fTimestamp(new Date(start + service.duration * 60000)));
      } else {
        setValue(`Additional_products[${index}].Product`, service);
        const start = getValues(`Additional_products[${index}].start`);

        setValue(
          `Additional_products[${index}].end`,
          fTimestamp(new Date(start + service.duration * 60000))
        );
      }
    },

    [setValue, getValues]
  );

  const handleSelectEmployee = useCallback(
    (index: number, option: string) => {},
    []
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: "text.disabled" }} gutterBottom>
        Appointments:
      </Typography>
      <Stack
        key={currentAppointment?.id}
        alignItems="flex-end"
        spacing={2.5}
        my={5}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ width: 1 }}
        >
          <RHFSelect
            name="product_id"
            size="small"
            label="Service"
            InputLabelProps={{ shrink: true }}
            sx={{
              maxWidth: { md: 400 },
            }}
          >
            <MenuItem
              value=""
              onClick={() => handleClearService(0)}
              sx={{ fontStyle: "italic", color: "text.secondary" }}
            >
              None
            </MenuItem>

            <Divider sx={{ borderStyle: "dashed" }} />

            {services?.map((service) => (
              <MenuItem
                key={service.id}
                value={service.id}
                onClick={() => handleSelectService(-1, service)}
              >
                {service.name}
              </MenuItem>
            ))}
          </RHFSelect>

          <RHFSelect
            name="employee_id"
            size="small"
            label="Employee"
            InputLabelProps={{ shrink: true }}
            sx={{
              maxWidth: { md: 400 },
            }}
          >
            <MenuItem
              value=""
              sx={{ fontStyle: "italic", color: "text.secondary" }}
            >
              None
            </MenuItem>

            <Divider sx={{ borderStyle: "dashed" }} />

            {employees?.map((employee) => (
              <MenuItem
                key={employee.id}
                value={employee.id}
                // onClick={() => handleSelectEmployee(employee.name)}
              >
                {employee.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ width: 1 }}
        >
          <Controller
            name="start"
            control={control}
            render={({ field }) => (
              <MobileDateTimePicker
                {...field}
                value={new Date(field.value as AppointmentDate)}
                onChange={(newValue) => {
                  if (newValue) {
                    field.onChange(fTimestamp(newValue));
                    const product = getValues("Product");
                    setValue(
                      `end`,
                      fTimestamp(
                        new Date(newValue.getTime() + product.duration * 60000)
                      )
                    );
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
                value={new Date(field.value as AppointmentDate)}
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
        </Stack>
      </Stack>

      <Stack
        divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
        spacing={1.5}
      >
        {fields
          .filter(
            (field, index) =>
              getValues(`Additional_products[${index}].deleted`) === 0
          )
          .map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={2.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFSelect
                  name={`Additional_products[${index}].product_id`}
                  size="small"
                  label="Service"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    maxWidth: { md: 400 },
                  }}
                >
                  <MenuItem
                    value=""
                    onClick={() => handleClearService(index)}
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: "dashed" }} />

                  {services?.map((service) => (
                    <MenuItem
                      key={service.id}
                      value={service.id}
                      onClick={() => handleSelectService(index, service)}
                    >
                      {service.name}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFSelect
                  name={`Additional_products[${index}].employee_id`}
                  size="small"
                  label="Employee"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    maxWidth: { md: 400 },
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: "dashed" }} />

                  {employees?.map((employee) => (
                    <MenuItem
                      key={employee.id}
                      value={employee.id}
                      onClick={() => handleSelectEmployee(index, employee.name)}
                    >
                      {employee.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ width: 1 }}
              >
                <Controller
                  name={`Additional_products[${index}].start`}
                  control={control}
                  render={({ field }) => (
                    <MobileDateTimePicker
                      {...field}
                      value={new Date(field.value as AppointmentDate)}
                      onChange={(newValue) => {
                        if (newValue) {
                          const product = getValues(
                            `Additional_products[${index}].Product`
                          );
                          if (product) {
                            setValue(
                              `Additional_products[${index}].end`,
                              fTimestamp(
                                new Date(
                                  newValue.getTime() + product.duration * 60000
                                )
                              )
                            );
                          }
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
                  name={`Additional_products[${index}].end`}
                  control={control}
                  render={({ field }) => (
                    <MobileDateTimePicker
                      {...field}
                      value={new Date(field.value as AppointmentDate)}
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
                            dateError &&
                            "End date must be later than start date",
                        },
                      }}
                    />
                  )}
                />
              </Stack>

              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </Stack>
          ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Stack
        spacing={1}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-end", md: "center" }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Appointment
        </Button>
      </Stack>
      <Stack
        direction={{ xs: "column", md: "row" }} // Vertical on xs, horizontal on md
        justifyContent="space-between" // Items at two ends when in row
        alignItems={{ xs: "stretch" }} // Aligns stretch in column, center in row
        spacing={2}
        my={4}
      >
        <Divider
          flexItem
          orientation={mdUp ? "vertical" : "horizontal"}
          sx={{ borderStyle: "dashed", order: { xs: 1, md: 3 } }}
        />

        {/* {renderTotal} */}
      </Stack>
    </Box>
  );
}
