"use client";

import debounce from "lodash.debounce";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import Autocomplete from "@mui/material/Autocomplete";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { type Theme, type SxProps } from "@mui/material/styles";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { Customer } from "src/types/customer";

// ----------------------------------------------------------------------

type LiveSearchProps = TextFieldProps & {
  name: string;
  native?: boolean;
  maxHeight?: boolean | number;
  helperText?: string;
  PaperPropsSx?: SxProps<Theme>;
  handleSelectedCustomer: (value: Customer | null) => void;
};

type props = {};
export default function LiveCustomerSearch({
  name,
  native,
  maxHeight = 220,
  helperText,
  PaperPropsSx,
  handleSelectedCustomer,
  ...other
}: LiveSearchProps) {
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [inputValue, setInputValue] = useState<string>(""); // The current input value in the search field

  console.log(helperText);
  // Debounced function to fetch search results
  const fetchCustomers = debounce(async (searchText: string) => {
    if (searchText) {
      try {
        const response = await fetch(
          `/api/salonapp/customer?search=${inputValue}`
        );
        const responseData = await response.json();
        setCustomerData(responseData?.data); // Update state with fetched data
      } catch (error) {
        console.log(error);
      }
    } else {
      setCustomerData([]);
    }
  }, 500); // 500ms debounce delay

  // Fetch customer data from API when the input value changes
  useEffect(() => {
    if (inputValue === "") {
      setCustomerData([]);
    }
  }, [inputValue]); // The effect runs whenever the input value changes

  return (
    <Stack>
      <Autocomplete
        id="customer-autocomplete"
        getOptionLabel={(customer: Customer) =>
          `${customer.firstname} ${customer.lastname} (${customer.telephone}) (${customer.email})`
        }
        sx={{ width: "100%", minWidth: 360 }}
        options={customerData} // Assuming this is an array of Customer objects
        isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by unique ID or another unique property
        noOptionsText="Search Customer"
        renderOption={(props, customer) => (
          <Box component="li" {...props} key={customer.id}>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={customer.firstname} sx={{ mr: 2 }}>
                    A
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${customer.firstname} ${customer.lastname}`}
                  secondary={
                    <Stack direction="column">
                      <Typography variant="subtitle1">
                        {customer.telephone}
                      </Typography>
                      <Typography variant="subtitle2">
                        {customer.email}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            </List>
          </Box>
        )}
        // Add the missing renderInput prop here
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Customer"
            name={name}
            variant="outlined"
            error={(helperText && true) || false}
            helperText={helperText}
            fullWidth
          />
        )}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue); // Update inputValue state
          fetchCustomers(newInputValue);
        }}
        onChange={(event: any, newValue: Customer | null) => {
          handleSelectedCustomer(newValue);
        }}
      />
    </Stack>
  );
}
