import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function InvoiceNewEditStatusDate() {
  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <Field.Text
        disabled
        name="invoiceNumber"
        label="Invoice number"
        value={values.invoiceNumber}
      />

      <Field.Select fullWidth name="status" label="Status" InputLabelProps={{ shrink: true }}>
        {[
          { id: 1, name: 'paid' },
          { id: 2, name: 'pending' },
          { id: 3, name: 'overdue' },
          { id: 4, name: 'draft' },
        ].map((option) => (
          <MenuItem key={option.id} value={option.id} sx={{ textTransform: 'capitalize' }}>
            {option.name}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.DatePicker name="date" label="Date create" />
      <Field.DatePicker name="dueDate" label="Due date" />
    </Stack>
  );
}
