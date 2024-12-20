import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import { useRouter } from 'src/routes/hooks';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  id: zod.string(),
  firstname: zod.string().min(1, { message: 'First Name is required!' }),
  lastname: zod.string().min(1, { message: 'Last Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  photoURL: schemaHelper.file({ message: 'Avatar is required!' }),
  telephone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  address: zod.string().min(1, { message: 'Address is required!' }),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const router = useRouter();

  const { t } = useTranslate();
  const { user } = useAuthContext();

  const currentUser: UpdateUserSchemaType = {
    id: user?.id.toString(),
    firstname: user?.firstname,
    lastname: user?.lastname,
    email: user?.email,
    photoURL: user?.photoURL,
    telephone: user?.telephone,
    address: user?.address,
  };

  const defaultValues: UpdateUserSchemaType = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    photoURL: null,
    telephone: '',
    address: '',
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const accountData = {
      id: Number(data.id),
      name: `${data.firstname} ${data.lastname}`,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      telephone: data.telephone,
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/account/general/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(`${t('general.update_failed')}:${responseData.message}`);
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        toast.success(t('general.update_success'));

        mutate(`/api/salonapp/customer/${user?.id}`);
        // Customer listing again
        router.push(paths.dashboard.account.settings);
      }
    } catch (error) {
      toast.error('Error');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <Field.Switch
              name="isPublic"
              labelPlacement="start"
              label="Public profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }} disabled>
              Delete user
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="firstname" label="First Name" />
              <Field.Text name="lastname" label="Last Name" />
              <Field.Text name="email" label="Email address" />
              <Field.Phone name="telephone" label="Phone number" />
              <Field.Text name="address" label="Address" />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
