import { useEffect, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import sum from "lodash/sum";
import Box from "@mui/material/Box";
import {
  Card,
  CardHeader,
  CardContent,
  Chip,
  Divider,
  Icon,
} from "@mui/material";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AppSettings } from "src/types/settings";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Radio from "@mui/material/Radio";
import { useBoolean } from "src/hooks/use-boolean";
import Iconify from "src/components/iconify";
import MenuItem from "@mui/material/MenuItem";
import { FnCurrency } from "src/utils/format-number";
import { Payment } from "src/types/invoice";
import { IPaymenttypes } from "src/types/payment";

// ----------------------------------------------------------------------

type Props = {
  paymenttypes?: IPaymenttypes[];
  appsettings: AppSettings[];
};
export default function PaymentNewEditForm({
  paymenttypes,
  appsettings,
}: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // const mdUp = useResponsive('up', 'md');

  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Payment",
  });

  const actualtotalOnRow = values.Payment.map((item: Payment) => item.value);

  const paymentTotal = sum(actualtotalOnRow);

  const balance = values.totalAmount - paymentTotal;

  const currency =
    appsettings.find((appsetting) => appsetting.name === "currency")?.value ||
    "INR";

  const paymentview = useBoolean();

  useEffect(() => {
    setValue("balance", balance);
  }, [setValue, balance]);

  const handlePaymentMehtod = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "SPLIT") {
      const id = paymenttypes?.find(
        (paymenttype) => paymenttype.name === event.target.value
      )?.id;

      remove();

      append({
        payment_type: id,
        value: values.totalAmount,
      });

      // setValue(`payments[${0}].payment_type`, id);
    } else {
      /*
      append({
        payment_type: 1,
        value: 0,
      });
      */
    }
  };

  const handleAdd = () => {
    const defaultpaymenttype = paymenttypes?.find(
      (paymentype) => paymentype.default_paymenttype
    );

    if (values.Payment.length === 0) {
      append({
        payment_type: defaultpaymenttype?.id,
        value: values.totalAmount,
      });
      setValue("balance", balance - values.totalAmount);
    } else {
      append({
        payment_type: 0,
        value: 0,
      });
    }
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleSelectPayment = useCallback(
    (index: number, payment: IPaymenttypes) => {
      setValue(`Payment[${index}].value`, values.totalAmount - paymentTotal);

      setValue(`Payment[${index}].payment_type`, payment?.id);
    },
    [setValue, values.totalAmount, paymentTotal]
  );

  const handleChangePrice = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number
    ) => {
      setValue(`Payment[${index}].value`, Number(event.target.value));
    },
    [setValue]
  );

  return (
    <Stack
      spacing={1}
      divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
      sx={{ order: { xs: 2, md: 1 } }}
    >
      <Card>
        <CardHeader
          title={
            <Typography
              variant="h6" // Custom font size and variant
              color="primary" // Custom color
              sx={{ color: "text.disabled" }}
            >
              Invoice Amount
            </Typography>
          }
          action={
            <IconButton>
              <Iconify icon="ph:contactless-payment" />
            </IconButton>
          }
        />
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            my={2}
            alignItems={{ xs: "stretch" }}
          >
            <Box
              component="span"
              sx={{ color: "text.secondary", width: 260, flexShrink: 1 }}
            >
              TOTAL DUE
            </Box>
            <Chip
              variant="outlined"
              color="primary"
              label={
                values.totalAmount > 0
                  ? FnCurrency(values.totalAmount, currency)
                  : FnCurrency(values.totalAmount, "0")
              }
            />
          </Stack>
          {/*
            <FormControl>
              <Typography variant="h6" color="text.primary" my={2}>
                Select payment method
              </Typography>
              {/*
              <FormLabel id="demo-radio-buttons-group-label">
                Select payment method
              </FormLabel>
       
              <RadioGroup
                row
                key="rad"
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={
                  paymenttypes?.find(
                    (pmtypes) => pmtypes.default_paymenttype === true
                  )?.name
                }
                name="radio-buttons-group"
                onChange={handlePaymentMehtod}
              >
                {paymenttypes
                  ?.filter((paymenttype) => paymenttype.name !== "SPLIT")
                  .map((item, index) => (
                    <FormControlLabel
                      value={item.name}
                      control={<Radio />}
                      label={item.name}
                    />
                  ))}
              </RadioGroup>
            </FormControl>
                  */}
          <Divider flexItem sx={{ borderStyle: "dashed" }} />
          <Typography variant="h6" color="text.disabled" my={2}>
            Payment
          </Typography>

          <Stack
            divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
            spacing={0.5}
          >
            {fields.map((item, index) => (
              <Stack key={item.id} alignItems="flex-end" spacing={0.5}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  sx={{ width: 1 }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ width: 1 }}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <RHFSelect
                      name={`Payment[${index}].payment_type`}
                      size="small"
                      label="Type"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        maxWidth: { md: 400 },
                      }}
                    >
                      <MenuItem
                        value=""
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        None
                      </MenuItem>

                      <Divider sx={{ borderStyle: "dashed" }} />

                      {paymenttypes
                        ?.filter((paymenttype) => paymenttype.name !== "SPLIT") // Correct filter logic
                        .map((paymenttype) => (
                          <MenuItem
                            key={paymenttype.id}
                            value={paymenttype.id}
                            onClick={() =>
                              handleSelectPayment(index, paymenttype)
                            }
                          >
                            {paymenttype.name}
                          </MenuItem>
                        ))}
                    </RHFSelect>

                    <RHFTextField
                      size="small"
                      type="number"
                      sx={{
                        width: "100%", // Optional: make it responsive within its container
                      }}
                      name={`Payment[${index}].value`}
                      label="Amount"
                      placeholder="0"
                      onChange={(event) => handleChangePrice(event, index)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                </Stack>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => handleRemove(index)}
                >
                  <HighlightOffIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
          <Stack
            spacing={1}
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-end", md: "center" }}
          >
            <IconButton
              aria-label="add"
              size="small"
              color="primary"
              onClick={handleAdd}
              sx={{ flexShrink: 0 }}
            >
              <ControlPointIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 1, borderStyle: "dashed" }} />
          <Stack
            direction="row"
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "flex-end", md: "center" }}
          >
            <Stack>
              <Box sx={{ color: "text.secondary" }}>Balance</Box>
            </Stack>
            <Stack>
              <Box
                sx={{
                  typography: "subtitle2",
                  color: balance === 0 ? "primary" : "error",
                }}
              >
                {balance === 0 ? (
                  <>
                    <Stack direction="row" spacing={2}>
                      <Typography>
                        {FnCurrency(String(balance), currency) || "-"}
                      </Typography>
                      <ThumbUpIcon color="primary" />
                    </Stack>
                  </>
                ) : (
                  <>
                    <Stack direction="row" spacing={2}>
                      <Typography>
                        {FnCurrency(String(balance), currency) || "-"}
                      </Typography>
                      <ThumbDownIcon color="error" />
                    </Stack>
                  </>
                )}
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
