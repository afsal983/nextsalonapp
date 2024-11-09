import * as Yup from "yup";
import { mutate } from "swr";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";

import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFTextField,
} from "src/components/hook-form";

import { type PaymentTypeItem } from "src/types/paymenttype";

// ----------------------------------------------------------------------

interface Props {
  currentPaymentType?: PaymentTypeItem;
}

export default function PaymentTypeNewEditForm({ currentPaymentType }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required(t("salonapp.service.name_fvalid_error")),
    description: Yup.string(),
    default_paymenttype: Yup.boolean(),
    is_authcode: Yup.boolean(),
    deleted: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentPaymentType?.id || "",
      name: currentPaymentType?.name || "",
      description: currentPaymentType?.description || "",
      default_paymenttype: currentPaymentType?.default_paymenttype || false,
      is_authcode: currentPaymentType?.is_authcode || false,
      deleted: currentPaymentType?.deleted || false,
    }),
    [currentPaymentType]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const paymenttypeData = {
      id: Number(data.id),
      name: data.name,
      desc: data.description,
      default_paymenttype: data.default_paymenttype,
      is_authcode: data.is_authcode,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/paymenttype`, {
        method: currentPaymentType ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymenttypeData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(
          currentPaymentType
            ? `${t("general.update_failed")}:${responseData.message}`
            : `${t("general.create_failed")}:${responseData.message}`,
          { variant: "error" }
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(
          currentPaymentType
            ? t("general.update_success")
            : t("general.create_success"),
          { variant: "success" }
        );

        mutate(`/api/salonapp/paymenttype/${currentPaymentType?.id}`);
        // PaymentTypeil listing again
        router.push(paths.dashboard.invoice.paymenttypes.list);
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField
                name="name"
                label={t("general.name")}
                helperText={t("salonapp.paymenttype.name_helper")}
              />
              <RHFTextField
                name="description"
                label={t("general.description")}
                helperText={t("salonapp.paymenttype.desc_helper")}
              />
              <RHFSwitch
                name="default_paymenttype"
                label={t("salonapp.paymenttype.default_payment")}
                helperText={t("salonapp.paymenttype.default_payment_helper")}
              />
              <RHFSwitch
                name="is_authcode"
                label={t("salonapp.paymenttype.auth_code")}
                helperText={t("salonapp.paymenttype.auth_code_helper")}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentPaymentType
                  ? t("salonapp.paymenttype.create_new_paymenttype")
                  : t("salonapp.paymenttype.save_paymenttype")}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
