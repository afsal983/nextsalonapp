import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import { RHFSelect, RHFAutocomplete } from "src/components/hook-form";

import { Schedule } from "src/types/employee";
import { EmployeeItem, type TimeSlotItem } from "src/types/employee";

// ----------------------------------------------------------------------

type Props = {
  currentWorkSchedule?: Schedule[];
  timeSlot: TimeSlotItem[];
  employee?: EmployeeItem[];
};

export default function WorkScheduleNewEditDetails({
  currentWorkSchedule,
  timeSlot,
  employee,
}: Props) {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employeeschedule",
  });

  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleAdd = () => {
    append({
      employee_id: 0,
      dayschedule: [
        { day: 0, slots: [] },
        { day: 1, slots: [] },
        { day: 2, slots: [] },
        { day: 3, slots: [] },
        { day: 4, slots: [] },
        { day: 5, slots: [] },
        { day: 6, slots: [] },
      ],
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap", p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        Employee Work Schedules:
      </Typography>

      <Stack
        divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
        spacing={3}
      >
        {fields.map((item, schedulecount) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ width: 1 }}
            >
              <RHFSelect
                name={`employeeschedule[${schedulecount}].employee_id`}
                size="small"
                label="employee"
                InputLabelProps={{ shrink: true }}
                sx={{
                  maxWidth: { md: 150 },
                }}
              >
                <MenuItem
                  value=""
                  sx={{ fontStyle: "italic", color: "text.secondary" }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: "dashed" }} />

                {employee?.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Firday",
                  "Saturday",
                  "Sunday",
                ].map((day: string, weekday: number) => (
                  <RHFAutocomplete
                    name={`employeeschedule[${schedulecount}].dayschedule[${weekday}].slots`}
                    label={day}
                    placeholder={t("salonapp.workschedule.plus_timeslots")}
                    multiple
                    freeSolo
                    options={timeSlot.map((option: TimeSlotItem) => ({
                      id: option?.id,
                      name: option?.name,
                    }))}
                    getOptionLabel={(option) =>
                      (option as { name: string }).name
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={(option as { id: string }).id}>
                        {(option as { name: string }).name}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={(option as { id: string }).id}
                          label={(option as { name: string }).name}
                          size="small"
                          color="info"
                          variant="soft"
                        />
                      ))
                    }
                    sx={{ width: "300px" }}
                  />
                ))}
              </Stack>
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(schedulecount)}
              >
                Remove
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Stack
        spacing={3}
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
          Add Item
        </Button>
      </Stack>
    </Box>
  );
}
