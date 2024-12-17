import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field, RHFTextField } from 'src/components/hook-form';

import { schemaHelper } from 'src/components/hook-form';

import { type BranchItem } from 'src/types/branch';
import { type LocationItem } from 'src/types/location';
import { type OrganizationItem } from 'src/types/organization';

// ----------------------------------------------------------------------

interface Props {
  currentBranch?: BranchItem;
  organization: OrganizationItem[];
  location: LocationItem[];
}

export type NewBranchSchemaType = zod.infer<typeof NewBranchSchema>;
const NewBranchSchema = zod.object({
  id: zod.number().optional(), // Optional field
  name: zod.string().min(1, { message: 'salonapp.branch.name_fvalid_error' }), // Required with error message
  reg_name: zod.string().min(1, { message: 'salonapp.branch.reg_fvalid_error' }), // Required with error message
  address: zod.string().optional(), // Optional field
  telephone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  taxid: zod.string().optional(), // Optional field
  org_id: zod.number().min(1, { message: 'salonapp.branch.orgid_fvalid_error' }), // Required with error message
  loc_id: zod.number().min(1, { message: 'salonapp.branch.locid_fvalid_error' }), // Required with error message
});
export default function BranchNewEditForm({ currentBranch, organization, location }: Props) {
  const router = useRouter();

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentBranch?.branch_id || '0',
      name: currentBranch?.name || '',
      reg_name: currentBranch?.reg_name || '',
      address: currentBranch?.address || '',
      telephone: currentBranch?.telephone || '',
      taxid: currentBranch?.taxid || '',
      org_id: currentBranch?.org_id || 1,
      loc_id: currentBranch?.loc_id || 1,
    }),
    [currentBranch]
  );

  const methods = useForm<NewBranchSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewBranchSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const BranchData = {
      branch_id: currentBranch?.branch_id,
      name: data.name,
      reg_name: data.reg_name,
      address: data.address,
      telephone: data.telephone,
      taxid: data.taxid,
      org_id: data.org_id,
      loc_id: data.loc_id,
    };
    console.log(BranchData);
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/branches`, {
        method: currentBranch ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(BranchData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.success(
          currentBranch
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentBranch ? t('general.update_success') : t('general.create_success'));

        mutate(`/api/salonapp/branches/${currentBranch?.branch_id}`);
        // Service listing again
        router.push(paths.dashboard.branches.list);
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
                label={t('salonapp.branch.brname')}
                helperText={t('salonapp.branch.bn_helper')}
              />
              <RHFTextField
                name="reg_name"
                label={t('salonapp.branch.regname')}
                helperText={t('salonapp.branch.rn_helper')}
              />
              <RHFTextField
                name="address"
                label={t('salonapp.branch.address')}
                helperText={t('salonapp.branch.add_helper')}
              />
              <RHFTextField
                name="telephone"
                label={t('salonapp.branch.telephone')}
                helperText={t('salonapp.branch.tp_helper')}
              />
              <RHFTextField
                name="taxid"
                label={t('salonapp.branch.taxid')}
                helperText={t('salonapp.branch.ti_helper')}
              />

              <Field.Select name="org_id" label={t('salonapp.branch.orgname')}>
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {organization.map((option) => (
                  <MenuItem key={option.org_id} value={option.org_id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Select name="loc_id" label={t('salonapp.branch.locname')}>
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {location.map((option) => (
                  <MenuItem key={option.loc_id} value={option.loc_id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentBranch
                  ? t('salonapp.branch.create_branch')
                  : t('salonapp.branch.save_branch')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
