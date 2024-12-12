import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { Field, RHFSelect } from 'src/components/hook-form';

import { ServiceItem } from 'src/types/service';
import { EmployeeItem } from 'src/types/employee';
import { AppointmentItem } from 'src/types/appointment';
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

  const mdUp = useResponsive('up', 'md');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'Additional_products',
  });

  const values = watch();

  console.log(values);
  // const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const handleAdd = () => {
    append({
      id: 0,
      event_id: 0,
      product_id: '',
      employee_id: '',
      start: '',
      end: '',
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
        const start = dayjs(getValues(`start`));

        setValue(`end`, start.add(service.duration, 'minute'));
      } else {
        setValue(`Additional_products[${index}].Product`, service);
        const start = dayjs(getValues(`Additional_products[${index}].start`));

        setValue(`Additional_products[${index}].end`, '');
      }
    },

    [setValue, getValues]
  );

  const handleSelectEmployee = useCallback((index: number, option: string) => {}, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled' }} gutterBottom>
        Appointments:
      </Typography>
      <Stack key={currentAppointment?.id} alignItems="flex-end" spacing={2.5} my={5}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
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
              sx={{ fontStyle: 'italic', color: 'text.secondary' }}
            >
              None
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

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
            <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              None
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

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
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
          <Field.MobileDateTimePicker
            name="start"
            label="Start"
            onChange={(newValue) => {
              if (newValue) {
                setValue(`start`, newValue);
                const product = getValues(`Product`);
                if (product) {
                  setValue(`end`, newValue.add(product.duration, 'minute'));
                }
              }
            }}
          />
          <Field.MobileDateTimePicker name="end" label="End" />
        </Stack>
      </Stack>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={1.5}>
        {fields
          .filter((field, index) => getValues(`Additional_products[${index}].deleted`) === 0)
          .map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={2.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
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
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

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
                  <MenuItem value="" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: 'dashed' }} />

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
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                <Field.MobileDateTimePicker
                  name={`Additional_products[${index}].start`}
                  label="Start"
                  onChange={(newValue) => {
                    if (newValue) {
                      setValue(`Additional_products[${index}].start`, newValue);
                      const product = getValues(`Additional_products[${index}].Product`);
                      if (product) {
                        setValue(
                          `Additional_products[${index}].end`,
                          newValue.add(product.duration, 'minute')
                        );
                      }
                    }
                  }}
                />

                <Field.MobileDateTimePicker
                  name={`Additional_products[${index}].end`}
                  label="End"
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

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={1}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
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
        direction={{ xs: 'column', md: 'row' }} // Vertical on xs, horizontal on md
        justifyContent="space-between" // Items at two ends when in row
        alignItems={{ xs: 'stretch' }} // Aligns stretch in column, center in row
        spacing={2}
        my={4}
      >
        <Divider
          flexItem
          orientation={mdUp ? 'vertical' : 'horizontal'}
          sx={{ borderStyle: 'dashed', order: { xs: 1, md: 3 } }}
        />

        {/* {renderTotal} */}
      </Stack>
    </Box>
  );
}
