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

import { type LocationItem } from "src/types/location";

// ----------------------------------------------------------------------

interface Props {
  currentLocation?: LocationItem;
}

export default function LocationNewEditForm({ currentLocation }: Props) {
  const router = useRouter();

  const timeStringToDate = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(0);
    return date;
  };

  const DatetoStimeString = (date: Date) => {
    // Extract hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format to HH:MM
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return date;
  };

  console.log(currentLocation);
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    loc_id: Yup.string(),
    name: Yup.string().required(t("salonapp.location.name_fvalid_error")),
    address: Yup.string(),
    telephone: Yup.string(),
    location_url: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      loc_id: currentLocation?.loc_id || "0",
      name: currentLocation?.name || "",
      address: currentLocation?.address || "",
      telephone: currentLocation?.telephone || "",
      location_url: currentLocation?.location_url || "",
    }),
    [currentLocation]
  );

  console.log(defaultValues);
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
    const LocationData = {
      loc_id: currentLocation?.loc_id,
      name: data.name,
      address: data.address,
      telephone: data.telephone,
      location_url: data.location_url,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/location`, {
        method: currentLocation ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(LocationData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(
          currentLocation
            ? `${t("general.update_failed")}:${responseData.message}`
            : `${t("general.create_failed")}:${responseData.message}`,
          { variant: "error" }
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(
          currentLocation
            ? t("general.update_success")
            : t("general.create_success"),
          { variant: "success" }
        );

        mutate(`/api/salonapp/location/${currentLocation?.loc_id}`);
        // Service listing again
        router.push(paths.dashboard.location.list);
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
                label={t("salonapp.location.locname")}
                helperText={t("salonapp.location.ln_helper")}
              />
              <RHFTextField
                name="address"
                label={t("salonapp.location.address")}
                helperText={t("salonapp.location.addr_helper")}
              />
              <RHFTextField
                name="telephone"
                label={t("salonapp.location.telephone")}
                helperText={t("salonapp.location.tel_helper")}
              />
              <RHFTextField
                name="location_url"
                label={t("salonapp.location.location_url")}
                helperText={t("salonapp.location.lu_helper")}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentLocation
                  ? t("salonapp.location.create_location")
                  : t("salonapp.location.save_location")}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
