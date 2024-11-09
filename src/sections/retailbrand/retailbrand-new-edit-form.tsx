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
import FormProvider, { RHFTextField } from "src/components/hook-form";

import { type RetailBrandItem } from "src/types/service";

// ----------------------------------------------------------------------

interface Props {
  currentRetailbrand?: RetailBrandItem;
}

export default function RetailBrandNewEditForm({ currentRetailbrand }: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required(t("salonapp.service.name_fvalid_error")),
    desc: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentRetailbrand?.id || "",
      name: currentRetailbrand?.name || "",
      desc: currentRetailbrand?.desc || "",
    }),
    [currentRetailbrand]
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
    const productData = {
      id: Number(data.id),
      name: data.name,
      desc: data.desc,
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/retailbrand`, {
        method: currentRetailbrand ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(
          currentRetailbrand
            ? `${t("general.update_failed")}:${responseData.message}`
            : `${t("general.create_failed")}:${responseData.message}`,
          { variant: "error" }
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(
          currentRetailbrand
            ? t("general.update_success")
            : t("general.create_success"),
          { variant: "success" }
        );

        mutate(`/api/salonapp/retailbrand/${currentRetailbrand?.id}`);
        // Retailbrandil listing again
        router.push(paths.dashboard.retailbrands.list);
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
                helperText={t("salonapp.service.sn_helper")}
              />
              <RHFTextField
                name="desc"
                label={t("general.description")}
                helperText={t("salonapp.service.desc_helper")}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentRetailbrand
                  ? t("salonapp.service.create_retailbrand")
                  : t("salonapp.service.save_retailbrand")}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
