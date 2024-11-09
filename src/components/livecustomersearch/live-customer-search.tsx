"use client";

import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import { Customer } from "src/types/customer";

// ----------------------------------------------------------------------

type props = {
  handleSelectedCustomer: (value: Customer | null) => void;
};
export default function LiveCustomerSearch({ handleSelectedCustomer }: props) {
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [inputValue, setInputValue] = useState<string>(""); // The current input value in the search field

  // Fetch customer data from API when the input value changes
  useEffect(() => {
    if (inputValue === "") {
      setCustomerData([]);
      return;
    }

    const fetchCustomers = async () => {
      try {
        const response = await fetch(
          `/api/salonapp/customer?search=${inputValue}`
        );
        const responseData = await response.json();
        setCustomerData(responseData?.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    // return () => {
    // clearTimeout(delayDebounceFn); // Cleanup, no return value expected
    // };
  }, [inputValue]); // The effect runs whenever the input value changes

  return (
    <Stack>
      <Autocomplete
        id="customer-autocomplete"
        getOptionLabel={(customer: Customer) =>
          `${customer.firstname} ${customer.lastname}`
        }
        sx={{ width: "100%", minWidth: 360, maxWidth: 360 }}
        options={customerData} // Assuming this is an array of Customer objects
        isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by unique ID or another unique property
        noOptionsText="Search Customer"
        renderOption={(props, customer) => (
          <Box component="li" {...props} key={customer.id}>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={customer.firstname} sx={{ mr: 2 }}>
                    A
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${customer.firstname} ${customer.lastname}`}
                  secondary={customer.telephone}
                />
              </ListItem>
            </List>
          </Box>
        )}
        // Add the missing renderInput prop here
        renderInput={(params) => (
          <TextField {...params} label="Select Customer" variant="outlined" />
        )}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue); // Update inputValue state
        }}
        onChange={(event: any, newValue: Customer | null) => {
          handleSelectedCustomer(newValue);
        }}
      />
    </Stack>
  );
}
