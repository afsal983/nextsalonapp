import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { schemaHelper } from 'src/components/hook-form';

import { toast } from 'src/components/snackbar';
import { Form, Field, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { type UserItem } from 'src/types/user';
import { type BranchItem } from 'src/types/branch';
import { type ServiceItem } from 'src/types/service';
import { type EmployeeItem } from 'src/types/employee';

// ----------------------------------------------------------------------

interface Props {
  currentEmployee?: EmployeeItem;
  branches: BranchItem[];
  services: ServiceItem[];
  users: UserItem[];
}
export type NewEmployeeSchemaType = zod.infer<typeof NewEmployeeSchema>;

const NewEmployeeSchema = zod.object({
  id: zod.string().optional(), // Optional string
  name: zod.string().min(1, { message: 'Enter Valid Name' }),
  address: zod.string().optional(), // Optional string
  telephone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  branch_id: zod.number().min(1, { message: 'Branch is required!' }),
  user_id: zod.number().optional(), // Optional number
  employeeservice: zod.array(zod.unknown()).optional(), // Optional array with any type of items
  avatarimagename: zod.string().optional(), // Optional string
});

export default function EmployeeNewEditForm({ currentEmployee, branches, users, services }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentEmployee?.id.toString() || '0',
      name: currentEmployee?.name || '',
      address: currentEmployee?.address || '',
      telephone: currentEmployee?.telephone || '',
      email: currentEmployee?.email || '',
      user_id: currentEmployee?.user_id || 0,
      branch_id: currentEmployee?.branch_id || 0,
      employeeservice:
        currentEmployee?.employeeservice.map((service) => ({
          service_id: service.service_id,
          name: service.Product.name,
        })) || [],
      avatarimagename: currentEmployee?.avatarimagename || '',
    }),
    [currentEmployee]
  );

  const methods = useForm<NewEmployeeSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewEmployeeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const employeeData = {
      id: Number(data.id),
      name: data.name,
      address: data.address,
      telephone: data.telephone,
      email: data.email,
      branch_id: data.branch_id,
      user_id: data.user_id,
      employeeservice: data.employeeservice,
      avatarimagename: currentEmployee?.avatarimagename,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/employee`, {
        method: currentEmployee ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentEmployee
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentEmployee ? t('general.update_success') : t('general.create_success'));

        mutate(`/api/salonapp/employee/${currentEmployee?.id}`);

        // Employee listing again
        router.push(paths.dashboard.employees.list);
      }
    } catch (error) {
      toast.error('Error');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ p: 3 }}>
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
                  label={t('salonapp.employee.emp_name')}
                  helperText={t('salonapp.employee.sn_helper')}
                />

                <RHFTextField name="address" label="Address" />

                <RHFTextField name="telephone" label="telephone" />

                <RHFTextField name="email" label="email" />

                <Field.Select name="branch_id" label={t('salonapp.employee.branch')}>
                  <MenuItem value="">None</MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {branches.map((option) => (
                    <MenuItem key={option.branch_id} value={option.branch_id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Select name="user_id" label={t('salonapp.employee.link_to_user_account')}>
                  <MenuItem value="">None</MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {users.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <RHFAutocomplete
                name="employeeservice"
                label={t('salonapp.employee.assign_employee_services')}
                placeholder={t('salonapp.employee.plus_services')}
                helperText={t('salonapp.employee.service_assign_helper')}
                multiple
                freeSolo
                options={services?.map((option: ServiceItem) => ({
                  id: option.id,
                  service_id: option.id,
                  employee_id: currentEmployee?.id || 0,
                  name: option.name,
                }))}
                getOptionLabel={(option) => (option as { name: string }).name}
                renderOption={(props, option) => (
                  <li {...props} key={(option as { service_id: string }).service_id}>
                    {(option as { name: string }).name}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={(option as { service_id: string }).service_id}
                      label={(option as { name: string }).name}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentEmployee
                  ? t('salonapp.employee.create_employee')
                  : t('salonapp.employee.save_employee')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
