'use client'

import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { fetcher } from 'src/utils/axios';
import {Customer} from 'src/types/customer';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------------------

type props = {
   handleSelectedCustomer : (value: string | undefined) => void;
}
export default function LiveCustomerSearch ({handleSelectedCustomer}: props) {

  const [ customerData, setCustomerData] = useState<Customer[]>([])
  const [inputValue, setInputValue] = useState<string>(''); // The current input value in the search field
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  // Fetch customer data from API when the input value changes
  useEffect(() => {
    if (inputValue === '') {
      setCustomerData([]);
      return;
    }

    // Set loading to true before fetching data
    setLoading(true);

    const fetchCustomers = async () => {
      try {
        const response = await fetch(`/api/salonapp/customer?search=${inputValue}`);
        const responseData = await response.json()
        setCustomerData(responseData?.data); // Update state with fetched data

      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    // Fetch customers after a slight delay (debouncing effect)
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 100); // Adjust debounce delay if needed

    // return () => {
      // clearTimeout(delayDebounceFn); // Cleanup, no return value expected
  // };
  }, [inputValue]); // The effect runs whenever the input value changes

  return (
    <Stack>
      <Autocomplete
        id="customer-autocomplete"
        getOptionLabel={(customer: Customer) => `${customer.firstname} ${customer.lastname}`}
        options={customerData} // Assuming this is an array of Customer objects
  
        isOptionEqualToValue={(option, value) => option.id === value.id} // Compare by unique ID or another unique property
        noOptionsText="Search Customer"
        renderOption={(props, customer) => (
          <Box component="li" {...props} key={customer.id}  >
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={customer.firstname} sx={{ mr: 2 }}>
                    A
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${customer.firstname} ${customer.lastname}`} 
                              secondary= {customer.telephone}
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
          handleSelectedCustomer(newValue?.id);
        }}
      />
    </Stack>
  )
}
