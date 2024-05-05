import * as Yup from "yup";
import { useMemo, useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MuiColorInput } from "mui-color-input";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { fData } from "src/utils/format-number";

import { countries } from "src/assets/data";

import Label from "src/components/label";
import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from "src/components/hook-form";

import { ServiceCategoryItem, ServiceItem } from "src/types/service";

import useSWR from "swr";
import { fetcher } from "src/utils/axios";

// ----------------------------------------------------------------------

type Props = {
  currentService?: ServiceItem;
  productcategory: ServiceCategoryItem[];
};

export default function ServiceNewEditForm({ currentService, productcategory }: Props) {
  const router = useRouter();
  const [color, setColor] = useState("#ffffff");


  const category = productcategory.map((item) => item.name);


  const { enqueueSnackbar } = useSnackbar();


  if (currentService) {
  }

  const handleChange = (color: string) => {
    setColor(color);
  };

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    duration: Yup.number().positive("Must be non zero value").required("Duration is required"),
    tax: Yup.number().required("Tax is required"),
    color: Yup.string().required("Country is required"),
    price: Yup.number().positive("Must be non zero value").required("Price is required"),
    category: Yup.string().required("Category is required"),
    onthetop: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentService?.name || "",
      duration: currentService?.duration || 15,
      tax: currentService?.tax || 0,
      color: currentService?.color || "#ffffff",
      price: currentService?.price || 0,
      category: currentService?.category || "",
      onthetop: currentService?.onthetop || true,
    }),
    [currentService],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    console.log("dddddd");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentService ? "Update success!" : "Create success!");
      router.push(paths.dashboard.services.list);
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
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
              <RHFTextField name="name" label="Service Name" />

              <RHFAutocomplete
                name="category"
                label="Service Category"
                autoHighlight
                options={category}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />

              <RHFTextField name="duration" label="Duration in minutes" />
              <RHFTextField name="price" label="Price(exclusive Tax" />
              <RHFTextField name="tax" label="Tax(%)" />
              <RHFTextField name="commission" label="Commission(%)" />
              <MuiColorInput
                name="color"
                label="Color"
                format="hex"
                value={color}
                onChange={handleChange}
              />
              <RHFSwitch name="onthetop" label="On the top" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentService ? "Create Service" : "Save Changes"}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
