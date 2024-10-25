import { useFormContext } from "react-hook-form";
import { useRef, useState, useCallback } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { BranchItem } from "src/types/branch";
import { Customer } from "src/types/customer";
import { LiveCustomerSearch } from "src/components/livecustomersearch";
import { BranchAddressListDialog } from "../branchaddress";
import { CustomerAddressListDialog } from "../customeraddress";

// ----------------------------------------------------------------------
type Props = {
  branches: BranchItem[];
};

export default function InvoiceNewEditAddress({ branches }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive("up", "md");

  const values = watch();

  const Customerdata = values?.Customer;

  const from = useBoolean();

  const to = useBoolean();

  // handle customer
  const handleSelectCustomer = useCallback(
    (value: Customer | null) => {
      // onFilters("filtervalue", typeof value === undefined ? "" : value);
      setValue("customer_id", value?.id);
      setValue("Customer", value);
    },
    [setValue]
  );

  const handleSelectBranch = useCallback(
    (value: BranchItem | null) => {
      // onFilters("filtervalue", typeof value === undefined ? "" : value);
      setValue("branch_id", value?.branch_id);
      setValue("Branches_organization", value);
    },
    [setValue]
  );

  return (
    <>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: "column", md: "row" }}
        divider={
          <Divider
            flexItem
            orientation={mdUp ? "vertical" : "horizontal"}
            sx={{ borderStyle: "dashed" }}
          />
        }
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: "text.disabled", flexGrow: 1 }}
            >
              From:
            </Typography>

            <Autocomplete
              id="customer-autocomplete"
              getOptionLabel={(branch: BranchItem) => `${branch.name}`}
              sx={{ width: "100%", minWidth: 360, maxWidth: 360 }}
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
                <TextField
                  {...params}
                  label="Select Branch"
                  variant="outlined"
                />
              )}
              onChange={(event: any, newValue: BranchItem | null) => {
                handleSelectBranch(newValue);
              }}
            />
            {/*
            <IconButton onClick={from.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
            */}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">
              {values.Branches_organization?.name}
            </Typography>
            <Typography variant="body2">
              {values.Branches_organization?.address}
            </Typography>
            <Typography variant="body2">
              {" "}
              {values.Branches_organization?.telephone}
            </Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: "text.disabled", flexGrow: 1 }}
            >
              To:
            </Typography>

            <LiveCustomerSearch handleSelectedCustomer={handleSelectCustomer} />
            {/*
            <IconButton onClick={to.onTrue}>
              <Iconify
                icon={invoiceTo ? "solar:pen-bold" : "mingcute:add-line"}
              />
            </IconButton>
            */}
          </Stack>

          {Customerdata ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                {values.Customer.firstname}
              </Typography>
              <Typography variant="body2">{values.Customer.address}</Typography>
              <Typography variant="body2">
                {" "}
                {values.Customer.telephone}
              </Typography>
            </Stack>
          ) : (
            <Typography typography="caption" sx={{ color: "error.main" }}>
              {(errors.invoiceTo as any)?.message}
            </Typography>
          )}
        </Stack>
      </Stack>

      {/*
      <BranchAddressListDialog
        title="Branches"
        open={from.value}
        onClose={from.onFalse}
        selected={(selectedId: string) => invoiceFrom?.id === selectedId}
        onSelect={(address) => setValue("invoiceFrom", address)}
        list={branches}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: "flex-end" }}
          >
            New
          </Button>
        }
      />

      <CustomerAddressListDialog
        title="Customers"
        open={to.value}
        onClose={to.onFalse}
        selected={(selectedId: string) => invoiceTo?.id === selectedId}
        onSelect={(address) => setValue("invoiceTo", address)}
        list={[]}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: "flex-end" }}
          >
            New
          </Button>
        }
      /> 
      */}
    </>
  );
}
