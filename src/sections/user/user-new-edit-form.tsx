import * as Yup from 'yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import LoadingButton from '@mui/lab/LoadingButton'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField
} from 'src/components/hook-form'

import { type BranchItem} from 'src/types/branch'
import { type UserItem, type UserRoleDB } from 'src/types/user'

// ----------------------------------------------------------------------

interface Props {
  currentUser?: UserItem
  userroles: UserRoleDB[]
  branches: BranchItem[]

}

export default function UserNewEditForm ({ currentUser, userroles, branches }: Props) {
  const router = useRouter()

  console.log(currentUser)
  const { enqueueSnackbar } = useSnackbar()

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    id: Yup.string(),
    firstname: Yup.string().required(t('salonapp.user.fn_fvalid_error')),
    lastname: Yup.string(),
    email: Yup.string().required(t('salonapp.user.em_fvalid_error')),
    password: Yup.string().required(t('salonapp.user.pw_fvalid_error')),
    telephone: Yup.string().required(t('salonapp.user.tel_fvalid_error')),
    pin: Yup.string(),
    branch_id: Yup.number().positive(t('general.must_be_non_zero')).required(t('general.branch_fvalid_error')),
    role_id: Yup.number().positive(t('general.must_be_non_zero')).required(t('general.roleid_fvalid_error')),
    address: Yup.string(),
    comment: Yup.string(),
    enabled: Yup.boolean()
  })

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || "0",
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      telephone: currentUser?.telephone || '',
      pin: currentUser?.pin || '',
      branch_id: currentUser?.branch_id || 0,
      role_id: currentUser?.role_id || 0,
      address: currentUser?.address || '',
      comment: currentUser?.comment || '',
      enabled: currentUser?.enabled || false
    }),
    [currentUser]
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
    const productData = {
      id: Number(data.id),
      name: `${data.firstname} ${data.lastname}`,
      firstname : data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      telephone: data.telephone,
      pin: data.pin,
      branch_id: data.branch_id,
      role_id: data.role_id,
      address: data.address,
      comment: data.comment,
      enabled: data.enabled
    }
    try {
      
      // Post the data 
      const response = await fetch(`/api/salonapp/user`, {
        method: currentUser? "PUT": "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if(responseData?.status > 401 ) {
        enqueueSnackbar(currentUser ? `${t('general.update_failed')}:${responseData.message}` : `${t('general.create_failed')}:${responseData.message}`, { variant: 'error' });
      } else {
        // Keep 500ms delay 
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset(); 
        enqueueSnackbar(currentUser ? t('general.update_success') : t('general.create_success'), { variant: 'success' });

        // User listing again
        router.push(paths.dashboard.user.list)
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
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)'
              }}
            >
              
              <RHFTextField name="firstname" label={t('salonapp.user.firstname')} helperText={t('salonapp.user.fn_helper')}/>
              <RHFTextField name="lastname" label={t('salonapp.user.lastname')} helperText={t('salonapp.user.ln_helper')}/>

              <RHFTextField name="email" type="email" label={t('salonapp.user.email')} />
              <RHFTextField name="password" type="password" label={t('salonapp.user.password')}/>

              <RHFTextField name="telephone" label={t('salonapp.user.telephone')} />
              <RHFTextField name="pin" label={t('salonapp.user.pin')} />

              <RHFSelect native name="branch_id" label={t('salonapp.user.branch_name')} InputLabelProps={{ shrink: true }}>
                <option key={0}>{ t('general.dropdown_select') }</option>
                {branches.map((item) => (
                  <option key={item.branch_id} value={item.branch_id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect native name="role_id" label={t('salonapp.user.role_name')} InputLabelProps={{ shrink: true }}>
                <option key={0}>{ t('general.dropdown_select') }</option>
                {userroles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="address" label={t('salonapp.user.address')} />

              <RHFTextField name="comments" label={t('salonapp.user.comments')} />

              <RHFSwitch name="enabled" label={t('salonapp.user.enabled')} helperText={t('salonapp.user.en_helper')}/>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentUser ? t('salonapp.user.create_user') : t('salonapp.user.save_user')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
