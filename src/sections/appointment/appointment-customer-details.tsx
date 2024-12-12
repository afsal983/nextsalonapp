import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Card,
  Avatar,
  Divider,
  Skeleton,
  CardHeader,
  IconButton,
  CardContent,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { LiveCustomerSearch } from 'src/components/livecustomersearch';

import { Customer } from 'src/types/customer';
// ----------------------------------------------------------------------

export default function AppointmentCustomerDetails() {
  const { control, setValue, watch, getValues } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const Customerdata = getValues('Customer');

  // handle customer
  const handleSelectCustomer = useCallback(
    (value: Customer | null) => {
      // onFilters("filtervalue", typeof value === undefined ? "" : value);
      setValue('customer_id', value?.id);
      setValue('Customer', value);
    },
    [setValue]
  );

  return (
    <Box sx={{ p: 0 }}>
      <Stack alignItems="flex-start" spacing={2.5}>
        <Typography variant="h6" sx={{ color: 'text.disabled' }} gutterBottom>
          Customer:
        </Typography>
        <LiveCustomerSearch
          name="customer_id"
          type="customer"
          label="Search Customer..."
          placeholder="Choose a country"
          handleSelectedCustomer={handleSelectCustomer}
          fullWidth
          options={[]}
          getOptionLabel={(option) => option}
        />
        {Customerdata ? (
          <Card variant="outlined" sx={{ width: 1, minHeight: 300 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: 'primary' }} aria-label="recipe">
                  {Customerdata?.firstname?.charAt(0)}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <Iconify icon="material-symbols:more-vert" />
                </IconButton>
              }
              title={`${Customerdata?.firstname} ${Customerdata?.lastname}`}
              subheader={Customerdata?.Category?.name}
            />
            <CardContent>
              <Stack divider={<Divider orientation="horizontal" flexItem />}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton aria-label="settings">
                    <Iconify icon="material-symbols:call" />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {Customerdata?.telephone}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton aria-label="settings">
                    <Iconify icon="ic:outline-email" />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {Customerdata?.email}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton aria-label="settings">
                    <Iconify icon="tabler:home" />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {Customerdata?.address}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ width: 1, minHeight: 300 }}>
            <Skeleton variant="rectangular" height={300} />
          </Card>
        )}
      </Stack>
    </Box>
  );
}
