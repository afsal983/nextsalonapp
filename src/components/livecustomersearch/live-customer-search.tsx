// import debounce from 'lodash.debounce';
import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Autocomplete, { type AutocompleteProps } from '@mui/material/Autocomplete';

import { countries } from 'src/assets/data';

import { Customer } from 'src/types/customer';

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'country' | string;
  helperText?: React.ReactNode;
  handleSelectedCustomer: (value: Customer | null) => void;
}

export default function LiveCustomerSearch<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  name,
  label,
  type,
  helperText,
  placeholder,
  handleSelectedCustomer,
  ...other
}: Omit<Props<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'>) {
  const { control, setValue } = useFormContext();

  const { multiple } = other;

  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [inputValue, setInputValue] = useState<string>(''); // The current input value in the search field

  // Debounced function to fetch search results
  let fetchTimeout: NodeJS.Timeout | null = null;

  const fetchCustomers = async (searchText: string) => {
    if (fetchTimeout) {
      clearTimeout(fetchTimeout); // Clear the previous timeout
    }

    fetchTimeout = setTimeout(async () => {
      if (searchText) {
        try {
          const response = await fetch(`/api/salonapp/customer?search=${searchText}`);
          const responseData = await response.json();
          setCustomerData(responseData?.data); // Update state with fetched data
        } catch (error) {
          console.log(error);
        }
      } else {
        setCustomerData([]);
      }
    }, 500); // 500ms delay
  };

  // Fetch customer data from API when the input value changes
  useEffect(() => {
    if (inputValue === '') {
      setCustomerData([]);
    }
  }, [inputValue]); // The effect runs whenever the input value changes

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          id={`autocomplete-${name}`}
          getOptionLabel={(customer: Customer) =>
            `${customer.firstname} ${customer.lastname} (${customer.telephone}) (${customer.email})`
          }
          sx={{ width: '100%', minWidth: 360 }}
          options={customerData} // Assuming this is an array of Customer objects
          isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by unique ID or another unique property
          noOptionsText="Search Customer"
          renderOption={(props, customer) => (
            <Box component="li" {...props} key={customer.id}>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
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
                        <Typography variant="subtitle1">{customer.telephone}</Typography>
                        <Typography variant="subtitle2">{customer.email}</Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error?.message : helperText}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
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
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function getCountry(inputValue: string) {
  const option = countries.filter((country) => country.label === inputValue)[0];

  return {
    ...option,
  };
}
