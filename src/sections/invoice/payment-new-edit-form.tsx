import { useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

import { Payment } from 'src/types/invoice';
import { IPaymenttypes } from 'src/types/payment';

// import { from } from 'stylis';


// ----------------------------------------------------------------------

type Props = {
  paymenttypes?: IPaymenttypes[];
  currentPayment?: Payment;
};
export default function PaymentNewEditForm({ currentPayment, paymenttypes }: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payments',
  });

  const { invoiceTo, invoiceFrom } = values;

  const from = useBoolean();

  const to = useBoolean();

  
  const handleSelectPayment = useCallback(
    (index: number, option: string) => {
      values.payments.map((items: Payment, count: number)=> {
          if(items?.value >0 && index !== count ) {
            setValue(
              `payments[${count}].value`,
              0
            );
          }
          return null; // Or return undefined
      })
      setValue(
        `payments[${index}].value`,
        values.totalAmount
      );
    },
    [setValue, values.totalAmount,values.payments]
  );

  const handleChangeamount = useCallback(
    (index: number, option: string) => {
      values.payments.map((items : Payment, count : number)=> {
          if(items?.value >0 && index !== count ) {
            setValue(
              `payments[${count}].value`,
              0
            );
          }
          return null; // Or return undefined
      })
      setValue(
        `payments[${index}].value`,
        values.totalAmount
      );
    },
    [setValue, values.totalAmount,values.payments]
  );


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Payment:
      </Typography>

      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        divider={
          <Divider
            flexItem
            orientation={mdUp ? 'vertical' : 'horizontal'}
            sx={{ borderStyle: 'dashed' }}
          />
        }
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              From:
            </Typography>

            <IconButton onClick={from.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">{invoiceFrom.name}</Typography>
            <Typography variant="body2">{invoiceFrom.address}</Typography>
            <Typography variant="body2"> {invoiceFrom.telephone}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Dialog fullWidth maxWidth="xs" open={from.value} onClose={from.onFalse}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 1, pr: 1.5 }}
        >
          <Typography variant="h6"> Select Payment for {values.totalAmount}</Typography>
        </Stack>
        <Box gap={1} p={1} display="grid" gridTemplateColumns="repeat(3, 1fr)">
          {paymenttypes?.map((item, index) => (
            <Stack spacing={1}>
              <Paper
                component={ButtonBase}
                variant="outlined"
                key={item.id}
                name={`payments[${index}].id`}
                onClick={() => handleSelectPayment(index, item.name)}
                sx={{
                  p: 2.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  flexDirection: 'column',
                  ...(item.default_paymenttype && {
                    borderWidth: 2,
                    borderColor: 'text.primary',
                  }),
                }}
              >
                <Iconify icon="solar:clock-circle-bold" width={32} sx={{ mb: 2 }} />
                {item.name}
              </Paper>
              <Stack spacing={2}>
                <RHFTextField
                  size="small"
                  label="Amount"
                  name={`payments[${index}].value`}
                  onChange={() => handleChangeamount(index, item.name)}
                  type="number" 
                />
                {item.is_authcode && 
                    <RHFTextField
                    size="small"
                    label="Authcode"
                    name={`payments[${index}].auth_code`}
                    type="text" 
                  />
                }
              </Stack>
            </Stack>
            ))}
        </Box>
      </Dialog>
    </Box>
  );
}
