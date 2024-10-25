import sum from "lodash/sum";
import { useEffect, useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { inputBaseClasses } from "@mui/material/InputBase";

import { FnCurrency } from "src/utils/format-number";

import Iconify from "src/components/iconify";
import { RHFSelect, RHFTextField } from "src/components/hook-form";

import { BranchItem } from "src/types/branch";
import { ServiceItem } from "src/types/service";
import { AppSettings } from "src/types/settings";
import { EmployeeItem } from "src/types/employee";
import { IInvoice, IInvoiceItem, Invoice_line } from "src/types/invoice";

// ----------------------------------------------------------------------

type Props = {
  services?: ServiceItem[];
  employees: EmployeeItem[];
  appsettings: AppSettings[];
  currentInvoice?: IInvoice;
  branches: BranchItem[];
  // paymentypes: IPaymenttypes[]
};

export default function InvoiceNewEditDetails({
  services,
  employees,
  appsettings,
  currentInvoice,
  branches,
}: Props) {
  const { control, setValue, getValues, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "Invoice_line",
  });

  const taxValue = appsettings.find(
    (appsetting) => appsetting.name === "taxValue"
  )?.value;

  const currency =
    appsettings.find((appsetting) => appsetting.name === "currency")?.value ||
    "INR";

  const tax = Number(taxValue) / 100;

  const values = watch();

  const actualtotalOnRow = values.Invoice_line.filter(
    (il: Invoice_line) => il.deleted === 0
  ).map((item: IInvoiceItem) => item.quantity * item.price);

  const actualTotal = sum(actualtotalOnRow);

  const totalOnRow = values.Invoice_line.filter(
    (il: Invoice_line) => il.deleted === 0
  ).map(
    (item: IInvoiceItem) =>
      item.quantity * (item.price - (item.price * item.discount) / 100)
  );

  const subTotal = sum(totalOnRow) - (sum(totalOnRow) * values.discount) / 100;

  const taxTotal = subTotal * tax;

  const discount = actualTotal - subTotal;

  const totalAmount = subTotal + values.tip + taxTotal;

  const customerSavings = discount + discount * tax;

  useEffect(() => {
    setValue("totalAmount", totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      employee: 0,
      service: 0,
      quantity: 1,
      price: 0,
      type: 0,
      discount: 0,
      total: 0,
      deleted: 0,
    });
  };

  const handleRemove = (index: number) => {
    const id = getValues(`Invoice_line[${index}].id`);
    // Dont Actually delete the item. Just set deleted = 1 nad list deleted = 0 for existing items
    if (id !== 0) {
      setValue(`Invoice_line[${index}].deleted`, 1);
    } else {
      // Dont care.. just delete
      remove(index);
    }
  };

  const handleClearService = useCallback(
    (index: number) => {
      resetField(`Invoice_line[${index}].quantity`);
      resetField(`Invoice_line[${index}].price`);
      resetField(`Invoice_line[${index}].total`);
    },
    [resetField]
  );

  const handleSelectService = useCallback(
    (index: number, service: ServiceItem) => {
      // This is for retails.. as the price inclusive tax
      if (service?.type !== 2) {
        setValue(`Invoice_line[${index}].price`, service?.price);
      } else {
        const actual_price = service.price / (1 + tax);
        setValue(`Invoice_line[${index}].price`, actual_price);
      }

      setValue(
        `Invoice_line[${index}].total`,
        values.Invoice_line.map(
          (item: IInvoiceItem) => item.quantity * item.price
        )[index]
      );

      setValue(`Invoice_line[${index}].Product`, service);
    },
    [setValue, tax, values.Invoice_line]
  );

  const handleSelectEmployee = useCallback(
    (index: number, option: string) => {},
    []
  );

  const handleChangeQuantity = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number
    ) => {
      setValue(`Invoice_line[${index}].quantity`, Number(event.target.value));
      setValue(
        `Invoice_line[${index}].total`,
        values.Invoice_line.map(
          (item: IInvoiceItem) =>
            item.quantity * (item.price - (item.price * item.discount) / 100)
        )[index]
      );
    },
    [setValue, values.Invoice_line]
  );

  const handleChangePrice = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number
    ) => {
      setValue(`Invoice_line[${index}].price`, Number(event.target.value));
      setValue(
        `Invoice_line[${index}].total`,
        values.Invoice_line.map(
          (item: IInvoiceItem) =>
            item.quantity * (item.price - (item.price * item.discount) / 100)
        )[index]
      );
    },
    [setValue, values.Invoice_line]
  );

  const handleItemDiscount = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index: number
    ) => {
      setValue(`Invoice_line[${index}].discount`, Number(event.target.value));
      setValue(
        `Invoice_line[${index}].total`,
        values.Invoice_line.map(
          (item: IInvoiceItem) =>
            item.quantity * (item.price - (item.price * item.discount) / 100)
        )[index]
      );
    },
    [setValue, values.Invoice_line]
  );

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: "right", typography: "body2" }}
    >
      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: "subtitle2" }}>
          {FnCurrency(subTotal, currency)}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Overerall Discount</Box>
        <Box sx={{ width: 160, typography: "subtitle2" }}>
          {FnCurrency(discount, currency) || "-"}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Tax Amount</Box>
        <Box sx={{ width: 160, typography: "subtitle2" }}>
          {FnCurrency(taxTotal, currency) || "-"}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Tip</Box>
        <Box
          sx={{
            width: 160,
            ...(values.tip && { color: "error.main" }),
          }}
        >
          {values.tip ? `+ ${FnCurrency(values.tip, currency)}` : "+"}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: "subtitle1" }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>
          {FnCurrency(totalAmount, currency) || "-"}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Rounded Total</Box>
        <Box sx={{ width: 160, typography: "subtitle2" }}>
          {FnCurrency(totalAmount, currency) || "-"}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: "text.secondary" }}>Customer Savings</Box>
        <Box sx={{ width: 160, typography: "subtitle2" }}>
          {FnCurrency(customerSavings, currency) || "-"}
        </Box>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: "text.disabled", mb: 3 }}>
        Details:
      </Typography>

      <Stack
        divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
        spacing={3}
      >
        {fields
          .filter(
            (field, index) => getValues(`Invoice_line[${index}].deleted`) === 0
          )
          .map((item, index) => (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ width: 1 }}
              >
                <RHFSelect
                  name={`Invoice_line[${index}].product_id`}
                  size="small"
                  label="Service"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    maxWidth: { md: 400 },
                  }}
                >
                  <MenuItem
                    value=""
                    onClick={() => handleClearService(index)}
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    None
                  </MenuItem>

                  <Divider sx={{ borderStyle: "dashed" }} />

                  {services?.map((service) => (
                    <MenuItem
                      key={service.id}
                      value={service.id}
                      onClick={() => handleSelectService(index, service)}
                    >
                      {service.name}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFSelect
                  name={`Invoice_line[${index}].employee_id`}
                  size="small"
                  label="Employee"
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

                  {employees?.map((employee) => (
                    <MenuItem
                      key={employee.id}
                      value={employee.id}
                      onClick={() => handleSelectEmployee(index, employee.name)}
                    >
                      {employee.name}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFTextField
                  size="small"
                  type="number"
                  name={`Invoice_line[${index}].quantity`}
                  label="Quantity"
                  placeholder="0"
                  onChange={(event) => handleChangeQuantity(event, index)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ maxWidth: { md: 96 } }}
                />

                <RHFTextField
                  size="small"
                  type="number"
                  name={`Invoice_line[${index}].price`}
                  label="Price"
                  placeholder="0.00"
                  onChange={(event) => handleChangePrice(event, index)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            typography: "subtitle2",
                            color: "text.disabled",
                          }}
                        >
                          {currency}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: { md: 96 } }}
                />

                <RHFTextField
                  size="small"
                  type="number"
                  name={`Invoice_line[${index}].discount`}
                  label="Discount(%)"
                  placeholder="0%"
                  onChange={(event) => handleItemDiscount(event, index)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            typography: "subtitle2",
                            color: "text.disabled",
                          }}
                        >
                          {currency}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: { md: 96 } }}
                />

                <RHFTextField
                  disabled
                  size="small"
                  type="number"
                  name={`Invoice_line[${index}].total`}
                  label="Total"
                  placeholder="0.00"
                  value={
                    (values.Invoice_line[index].price -
                      (values.Invoice_line[index].price *
                        values.Invoice_line[index].discount) /
                        100) *
                    values.Invoice_line[index].quantity
                  }
                  onChange={(event) => handleChangePrice(event, index)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            typography: "subtitle2",
                            color: "text.disabled",
                          }}
                        >
                          {currency}
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    maxWidth: { md: 104 },
                    [`& .${inputBaseClasses.input}`]: {
                      textAlign: { md: "right" },
                    },
                  }}
                />
                {/*
              <RHFTextField
                size="small"
                type="number"
                name={`Invoice_line[${index}].type`}
                label="Type"
                placeholder="0"
                style={{ display: "none" }}
                InputLabelProps={{ shrink: true }}
              />
              */}
              </Stack>

              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                Remove
              </Button>
            </Stack>
          ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: "dashed" }} />

      <Stack
        spacing={3}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-end", md: "center" }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>

        <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: "column", md: "row" }}
          sx={{ width: 1 }}
        >
          <RHFTextField
            size="small"
            label="Tip($)"
            name="tip"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          />

          <RHFTextField
            size="small"
            label="Discount(%)"
            name="discount"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          />
        </Stack>
      </Stack>

      {renderTotal}
    </Box>
  );
}
