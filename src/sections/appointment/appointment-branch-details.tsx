import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Stack, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDate, fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { BranchItem } from 'src/types/branch';
// ----------------------------------------------------------------------

export default function AppointmentBranchDetails() {
  const { control, setValue, getValues, watch, resetField } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const Branchdata = values?.Branches_organization;

  const handleSelectBranch = useCallback(
    (value: BranchItem | null) => {
      setValue('branch_id', value?.branch_id);
      setValue('Branches_organization', value);
    },
    [setValue]
  );

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ justifyContent: 'space-between', my: 3 }}
      spacing={{ xs: 3, md: 1 }}
    >
      <Stack direction="column" sx={{ mb: 1 }} spacing={1} alignItems="flex-start">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/*
          <Typography variant="h6" sx={{ color: "text.disabled", flexGrow: 1 }}>
            From:
          </Typography>
  

          <Autocomplete
            id="branch_id"
            getOptionLabel={(branch: BranchItem) => `${branch.name}`}
            sx={{
              width: {
                xs: 1, // Full width on extra small screens
                sm: 380, // Fixed width on small screens and above
              },
              minWidth: 360,
            }}
            options={branches} // Assuming this is an array of Customer objects
            isOptionEqualToValue={(option, value) =>
              option.branch_id === value.branch_id
            } // Compare by unique ID or another unique property
            noOptionsText="Search Branch"
            renderOption={(props, branch) => (
              <Box component="li" {...props} key={branch.branch_id}>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt={branch.name} sx={{ mr: 2 }}>
                        A
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${branch.name}`}
                      secondary={branch.telephone}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
            // Add the missing renderInput prop here
            renderInput={(params) => (
              <TextField {...params} label="Select Branch" variant="outlined" />
            )}
            onChange={(event: any, newValue: BranchItem | null) => {
              handleSelectBranch(newValue);
            }}
          />
                */}
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">{Branchdata?.name}</Typography>
          <Typography variant="body2">{Branchdata?.address}</Typography>
          <Typography variant="body2"> {Branchdata?.telephone}</Typography>
        </Stack>
      </Stack>

      <Stack spacing={1} alignItems="right">
        <Stack direction="row" spacing={2} alignItems="center">
          <Iconify width={40} icon="fluent-mdl2:date-time" />
          <Box>
            <Typography variant="subtitle2">Date: {fDate(Date())}</Typography>
            <Typography variant="subtitle2">Time: {fTime(Date())}</Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
