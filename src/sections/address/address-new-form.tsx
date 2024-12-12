import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { countries } from 'src/assets/data';

import {
  Form,
  RHFCheckbox,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IAddressItem } from 'src/types/address';

const NewAddressSchema = zod.object({
  name: zod.string({ required_error: 'Fullname is required' }), // Required string with custom error
  phoneNumber: zod.string({ required_error: 'Phone number is required' }), // Required string with custom error
  address: zod.string({ required_error: 'Address is required' }), // Required string with custom error
  city: zod.string({ required_error: 'City is required' }), // Required string with custom error
  state: zod.string({ required_error: 'State is required' }), // Required string with custom error
  country: zod.string({ required_error: 'Country is required' }), // Required string with custom error
  zipCode: zod.string({ required_error: 'Zip code is required' }), // Required string with custom error
  addressType: zod.string().optional(), // Optional string
  primary: zod.boolean().optional(), // Optional boolean
});

export type NewAddressSchemaType = zod.infer<typeof NewAddressSchema>;

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (address: IAddressItem) => void;
};

export default function AddressNewForm({ open, onClose, onCreate }: Props) {
  const defaultValues = {
    name: '',
    city: '',
    state: '',
    address: '',
    zipCode: '',
    primary: true,
    phoneNumber: '',
    addressType: 'Home',
    country: '',
  };

  const methods = useForm<NewAddressSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onCreate({
        name: data.name,
        telephone: data.phoneNumber,
        address: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
        location: data.name,
        addressType: data.addressType,
        primary: data.primary,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New address</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <RHFRadioGroup
              row
              name="addressType"
              options={[
                { label: 'Home', value: 'Home' },
                { label: 'Office', value: 'Office' },
              ]}
            />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />

              <RHFTextField name="phoneNumber" label="Phone Number" />
            </Box>

            <RHFTextField name="address" label="Address" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="city" label="Town / City" />

              <RHFTextField name="state" label="State" />

              <RHFTextField name="zipCode" label="Zip/Code" />
            </Box>

            <RHFAutocomplete
              name="country"
              label="Country"
              placeholder="Choose a country"
              options={countries.map((option) => option.label)}
              getOptionLabel={(option) => option}
            />

            <RHFCheckbox name="primary" label="Use this address as default." />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Deliver to this Address
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
