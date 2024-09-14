import * as Yup from 'yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import LoadingButton from '@mui/lab/LoadingButton'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete
} from 'src/components/hook-form'

import { type UserItem } from 'src/types/user'
import { type BranchItem } from 'src/types/branch'
import { type ServiceItem } from 'src/types/service'
import { type EmployeeItem } from 'src/types/employee'

// ----------------------------------------------------------------------

interface Props {
  currentEmployee?: EmployeeItem
  branches: BranchItem[]
  services: ServiceItem[]
  users: UserItem[]
}

export default function EmployeeNewEditForm ({ currentEmployee, branches, users, services}: Props) {
  const router = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required(t('salonapp.employee.name_fvalid_error')),
    address: Yup.string(),
    telephone: Yup.string().required(t('general.color_fvalid_error')),
    email: Yup.string().required(t('general.color_fvalid_error')),
    branch_id: Yup.number(),
    user_id: Yup.number(),
    employeeservice: Yup.array(),
    avatarimagename: Yup.string()
  })

  const defaultValues = useMemo(
    () => ({
      id: currentEmployee?.id || "0",
      name: currentEmployee?.name || '',
      address: currentEmployee?.address || "",
      telephone: currentEmployee?.telephone || "",
      email: currentEmployee?.email || "",
      user_id: currentEmployee?.user_id || 0,
      branch_id: currentEmployee?.branch_id || 0,
      employeeservice: currentEmployee?.employeeservice || [],
      avatarimagename: currentEmployee?.avatarimagename || ''

    }),
    [currentEmployee]
  )

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues
  })

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting }
  } = methods


  const onSubmit = handleSubmit(async (data) => {
    const employeeData = {
      id: Number(data.id),
      name : data.name,
      address: data.address,
      telephone: data.telephone,
      email: data.email,
      branch_id: data.branch_id,
      user_id: data.user_id,
      employeeservice: data.employeeservice,
      avatarimagename: currentEmployee?.avatarimagename
    }

    try {
      
      // Post the data 
      const response = await fetch(`/api/salonapp/employee`, {
        method: currentEmployee? "PUT": "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const responseData = await response.json();

      if(responseData?.status > 401 ) {
        enqueueSnackbar(currentEmployee ? `${t('general.update_failed')}:${responseData.message}` : `${t('general.create_failed')}:${responseData.message}`, { variant: 'error' });
      } else {
        // Keep 500ms delay 
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset(); 
        enqueueSnackbar(currentEmployee ? t('general.update_success') : t('general.create_success'), { variant: 'success' });

        // Employee listing again
        router.push(paths.dashboard.employees.list)
      }
    } catch (error) {
        enqueueSnackbar(error, { variant: 'error' });
    }
  })

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)'
                }}
              >
                
                <RHFTextField name="name" label={t('salonapp.employee.emp_name')} helperText={t('salonapp.employee.sn_helper')}/>

                <RHFTextField name="address" label="Address" />

                <RHFTextField name="telephone" label="telephone" />

                <RHFTextField name="email" label="email" />

                <RHFSelect native name="branch_id" label={t('salonapp.employee.branch')} InputLabelProps={{ shrink: true }}>
                  <option key={0}>{ t('general.dropdown_select') }</option>
                  {branches.map((item) => (
                    <option key={item.branch_id} value={item.branch_id}>
                      {item.name}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect native name="user_id" label={t('salonapp.employee.link_to_user_account')} InputLabelProps={{ shrink: true }}>
                  <option key={0}>{ t('general.dropdown_select') }</option>
                  {users.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </RHFSelect>
              </Box>

              <RHFAutocomplete
                name="employeeservice"
                label= { t('salonapp.employee.assign_employee_services') }
                placeholder={ t('salonapp.employee.plus_services')}
                helperText={t('salonapp.employee.service_assign_helper')}
                multiple
                freeSolo
                options={services?.map((option:  ServiceItem)  => ({
                  id: option.id,
                  service_id: option.id,
                  employee_id: currentEmployee?.id || 0,
                  name: option.name
                }))}
                getOptionLabel={(option) => (option as { name: string }).name}
                renderOption={(props, option ) => (
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
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentEmployee ? t('salonapp.employee.create_employee') : t('salonapp.employee.save_employee')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
