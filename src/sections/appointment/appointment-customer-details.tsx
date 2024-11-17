import sum from "lodash/sum";
import { useEffect, useCallback } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  Divider,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Avatar,
  CardMedia,
  Skeleton,
} from "@mui/material";

import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Typography from "@mui/material/Typography";
import { useResponsive } from "src/hooks/use-responsive";
import { isAfter } from "src/utils/format-time";

import { BranchItem } from "src/types/branch";
import { ServiceItem } from "src/types/service";
import { Customer } from "src/types/customer";

import { LiveCustomerSearch } from "src/components/livecustomersearch";
// ----------------------------------------------------------------------

export default function AppointmentCustomerDetails() {
  const { control, setValue, watch, getValues } = useFormContext();

  const mdUp = useResponsive("up", "md");

  const Customerdata = getValues("Customer");

  // handle customer
  const handleSelectCustomer = useCallback(
    (value: Customer | null) => {
      // onFilters("filtervalue", typeof value === undefined ? "" : value);
      setValue("customer_id", value?.id);
      setValue("Customer", value);
    },
    [setValue]
  );

  return (
    <Box sx={{ p: 0 }}>
      <Stack alignItems="flex-start" spacing={2.5}>
        <Typography variant="h6" sx={{ color: "text.disabled" }} gutterBottom>
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
                <Avatar sx={{ bgcolor: "primary" }} aria-label="recipe">
                  {Customerdata?.firstname?.charAt(0)}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={`${Customerdata?.firstname} ${Customerdata?.lastname}`}
              subheader={Customerdata?.Category?.name}
            />
            <CardContent>
              <Stack divider={<Divider orientation="horizontal" flexItem />}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton aria-label="settings">
                    <CallIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {Customerdata?.telephone}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton aria-label="settings">
                    <EmailIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {Customerdata?.email}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <IconButton aria-label="settings">
                    <HomeIcon />
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
