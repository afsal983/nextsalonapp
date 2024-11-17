import sum from "lodash/sum";
import { useEffect, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Card, Chip, Divider, CardHeader, CardContent } from "@mui/material";

import { FnCurrency } from "src/utils/format-number";

import Iconify from "src/components/iconify";
import { RHFSelect, RHFTextField } from "src/components/hook-form";

import { Payment } from "src/types/invoice";
import { AppSettings } from "src/types/settings";
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

  useEffect(() => {
    setValue("balance", balance);
  }, [setValue, balance]);

  const handleAdd = () => {
    const defaultpaymenttype = paymenttypes?.find(
      (paymentype) => paymentype.default_paymenttype
    );

    if (values.Payment.length === 0) {
      append({
        payment_type: defaultpaymenttype?.id,
        value: values.totalAmount,
        auth_code: "",
      });
      setValue("balance", balance - values.totalAmount);
    } else {
      append({
        payment_type: 0,
        value: 0,
        auth_code: "",
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

  const handleChangeAuthcode = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number
    ) => {
      console.log(event.target.value);
      setValue(`Payment[${index}].auth_code`, event.target.value);
    },
    [setValue]
  );

  return (
    <Stack
      spacing={1}
      divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
      sx={{ order: { xs: 2, md: 1 }, width: 1 }}
    >
      <Card sx={{ width: 1 }}>
        <CardHeader
          title={
            <Typography
              variant="h6" // Custom font size and variant
              color="primary" // Custom color
              sx={{ color: "text.disabled" }}
            >
              Payment
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
            direction={{ xs: "row" }}
            justifyContent="space-between"
            my={2}
            sx={{ width: 1 }}
            alignItems={{ xs: "stretch" }}
          >
            <Box
              component="div"
              sx={{ color: "text.secondary", flexShrink: 1 }}
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

                    <RHFTextField
                      size="small"
                      type="input"
                      sx={{
                        width: "100%", // Optional: make it responsive within its container
                      }}
                      name={`Payment[${index}].auth_code`}
                      label="Authcode"
                      placeholder=""
                      onChange={(event) => handleChangeAuthcode(event, index)}
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
                  <Stack direction="row" spacing={2}>
                    <Typography>
                      {FnCurrency(String(balance), currency) || "-"}
                    </Typography>
                    <ThumbUpIcon color="primary" />
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Typography>
                      {FnCurrency(String(balance), currency) || "-"}
                    </Typography>
                    <ThumbDownIcon color="error" />
                  </Stack>
                )}
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
