import * as Yup from "yup";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { MuiColorInput } from "mui-color-input";

import { countries } from "src/assets/data";
import { USER_STATUS_OPTIONS } from "src/_mock";

import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from "src/components/hook-form";

import { IServiceItem } from "src/types/service";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentService?: IServiceItem;
};

export default function ServiceQuickEditForm({
  currentService,
  open,
  onClose,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [color, setColor] = useState("#ffffff");

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    duration: Yup.number().required("Duration is required"),
    tax: Yup.number().required("Tax is required"),
    color: Yup.string().required("Country is required"),
    price: Yup.number().required("Price is required"),
    category: Yup.number().required("Category is required"),
    onthetop: Yup.boolean(),
  });

  const handleChange = (color: string) => {
    setColor(color);
  };

  const defaultValues = useMemo(
    () => ({
      name: currentService?.name || "",
      duration: currentService?.duration || 15,
      tax: currentService?.tax || 0,
      color: currentService?.color || "",
      price: currentService?.price || 0,
      category: currentService?.category || 0,
      onthetop: currentService?.onthetop || true,
      commission: currentService?.commission || 0,
    }),
    [currentService],
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      enqueueSnackbar("Update success!");
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Account is waiting for confirmation
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFAutocomplete
              name="category"
              label="Service Category"
              autoHighlight
              options={[""]}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
            />

            <RHFTextField
              name="duration"
              value={defaultValues.duration}
              label="Duration in minutes"
            />
            <RHFTextField
              name="price"
              value={defaultValues.price}
              label="Price(exclusive Tax"
            />
            <RHFTextField name="tax" value={defaultValues.tax} label="Tax(%)" />
            <RHFTextField
              name="commission"
              value={defaultValues.commission}
              label="Commission(%)"
            />

            <MuiColorInput
              name="color"
              label="Color"
              format="hex"
              value={defaultValues.color}
              onChange={handleChange}
            />
            <RHFSwitch name="onthetop" label="On the top" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
