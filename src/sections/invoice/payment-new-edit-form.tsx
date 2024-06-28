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

  console.log(values)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'payments',
  });


  const from = useBoolean();

  const to = useBoolean();

  
  const handleSelectPayment = useCallback(
    (index: number, option: string) => {

      const selected_payment = paymenttypes?.find((payment) => payment.name === option)
      // console.log(selected_payment)
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
      setValue(
        `payments[${index}].payment_type`,
        selected_payment?.id
      );
    },
    [setValue, values.totalAmount,values.payments]
  );

  const handleChangeamount = useCallback(
    (index: number, option: string, event) => {
      values.payments.map((items : Payment, count : number)=> {
          if(items?.value > event.target.value && index !== count ) {
            setValue(
              `payments[${count}].value`,
              items?.value - event.target.value
            );
            return true; 
          }
          
          // return null; // Or return undefined
      })
      setValue(
        `payments[${index}].value`,
        event.target.value
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
        spacing={2}
        alignItems="flex-end"
        sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
      >
        <Stack direction="row">
          <Box sx={{ color: 'text.secondary' }}>Payment by</Box>
            <Box sx={{ width: 160, typography: 'subtitle2' }}>
              {currentPayment && paymenttypes?.map((paymenttype)=> paymenttype.default_paymenttype && paymenttype.name )}
              <IconButton onClick={from.onTrue}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Box>
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
          {paymenttypes?.filter(item => !item.name.toLowerCase().includes('split')).map((item, index) => (
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
                  onChange={(event) => handleChangeamount(index, item.name, event)}
                  type="number" 
                />
                <RHFTextField
                  size="small"
                  type="number"
                  name={`payments[${index}].payment_type`}
                  label="Type"
                  placeholder="0"
                  style={{ display: 'none' }}
                  InputLabelProps={{ shrink: true }}
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
