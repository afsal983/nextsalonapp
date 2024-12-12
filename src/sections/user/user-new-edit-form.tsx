import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, RHFSelect, RHFTextField } from 'src/components/hook-form';

import { type BranchItem } from 'src/types/branch';
import { type UserItem, type UserRoleDB } from 'src/types/user';

// ----------------------------------------------------------------------

interface Props {
  currentUser?: UserItem;
  userroles: UserRoleDB[];
  branches: BranchItem[];
}

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

const NewUserSchema = zod.object({
  id: zod.string().optional(), // Optional string field
  firstname: zod.string().min(1, { message: 'Name invalid' }), // Required string with custom error
  lastname: zod.string().optional(), // Optional string field
  email: zod.string().email().min(1, { message: 'Invalid Email' }), // Required email with custom error
  password: zod.string().min(1, { message: 'Invalid passowrd' }), // Required password with custom error
  telephone: zod.string().min(1, { message: 'Telephone invalid' }), // Required string with custom error
  pin: zod.string().optional(), // Optional string field
  branch_id: zod.number().positive({ message: 'Branch Required' }),
  role_id: zod.number().positive({ message: 'Role required' }),
  address: zod.string().optional(), // Optional string field
  comment: zod.string().optional(), // Optional string field
  enabled: zod.boolean().optional(), // Optional boolean field
});

export default function UserNewEditForm({ currentUser, userroles, branches }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentUser?.id || '0',
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
      enabled: currentUser?.enabled || false,
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const productData = {
      id: Number(data.id),
      name: `${data.firstname} ${data.lastname}`,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      telephone: data.telephone,
      pin: data.pin,
      branch_id: data.branch_id,
      role_id: data.role_id,
      address: data.address,
      comment: data.comment,
      enabled: data.enabled,
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/user`, {
        method: currentUser ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentUser
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentUser ? t('general.update_success') : t('general.create_success'));

        mutate(`/api/salonapp/user/${currentUser?.id}`);
        // User listing again
        router.push(paths.dashboard.user.list);
      }
    } catch (error) {
      toast.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
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
                name="firstname"
                label={t('salonapp.user.firstname')}
                helperText={t('salonapp.user.fn_helper')}
              />
              <RHFTextField
                name="lastname"
                label={t('salonapp.user.lastname')}
                helperText={t('salonapp.user.ln_helper')}
              />

              <RHFTextField name="email" type="email" label={t('salonapp.user.email')} />
              <RHFTextField name="password" type="password" label={t('salonapp.user.password')} />

              <RHFTextField name="telephone" label={t('salonapp.user.telephone')} />
              <RHFTextField name="pin" label={t('salonapp.user.pin')} />

              <RHFSelect
                native
                name="branch_id"
                label={t('salonapp.user.branch_name')}
                InputLabelProps={{ shrink: true }}
              >
                <option key={0}>{t('general.dropdown_select')}</option>
                {branches.map((item) => (
                  <option key={item.branch_id} value={item.branch_id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="role_id"
                label={t('salonapp.user.role_name')}
                InputLabelProps={{ shrink: true }}
              >
                <option key={0}>{t('general.dropdown_select')}</option>
                {userroles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="address" label={t('salonapp.user.address')} />

              <RHFTextField name="comments" label={t('salonapp.user.comments')} />

              <RHFSwitch
                name="enabled"
                label={t('salonapp.user.enabled')}
                helperText={t('salonapp.user.en_helper')}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? t('salonapp.user.create_user') : t('salonapp.user.save_user')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
