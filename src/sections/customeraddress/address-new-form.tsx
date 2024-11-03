import useSWR from "swr";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { fetcher } from "src/utils/axios";

import { useTranslate } from "src/locales";

import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFRadioGroup,
} from "src/components/hook-form";

import { Customer, CustomerCategory } from "src/types/customer";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onCreate: (address: Customer) => void;
};

export default function AddressNewForm({ open, onClose, onCreate }: Props) {
  const NewAddressSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string(),
    telephone: Yup.string().required("Phone number is required"),
    email: Yup.string().required("Email is required"),
    cardno: Yup.string(),
    taxid: Yup.string(),
    address: Yup.string(),
    comments: Yup.string(),
    dob: Yup.mixed<any>().nullable(),
    sex: Yup.number().required("Sex is required"),
    category_id: Yup.number().required("Categoryis required"),
    // not required
    promonotify: Yup.boolean(),
    eventnotify: Yup.boolean(),
  });
  const { t } = useTranslate();

  // Use SWR to fetch data from multiple endpoints in parallel
  const { data: customercategory, error: errorC } = useSWR(
    "/api/salonapp/customercategory",
    fetcher
  );

  const defaultValues = {
    firstname: "",
    lastname: "",
    telephone: "",
    email: "",
    cardno: "",
    taxid: "",
    address: "",
    comments: "",
    dob: null,
    sex: 0,
    category_id: 0,
    // not required
    promonotify: false,
    eventnotify: false,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    let isoDateString;

    // Create a new Date object from the string
    if (!data?.dob) {
      const dateObj = new Date("1970-01-01");
      // Convert to ISO string with UTC time
      isoDateString = dateObj.toLocaleDateString("en-CA");
    }

    try {
      onCreate({
        id: "",
        CustomerCategory: {
          id: "",
          name: "",
          discount: 0,
          default_category: false,
        },
        firstname: data.firstname,
        lastname: data.lastname || "",
        comment: data.comments || "",
        telephone: data.telephone,
        email: data.email,
        cardno: data.cardno || "",
        taxid: data.taxid || "",
        address: data.address || "",
        sex: data.sex,
        dob: isoDateString || null,
        category_id: Number(data.category_id),
        CustomerPreference: {
          customer_id: 0,
          promonotify: data.promonotify || false,
          eventnotify: data.eventnotify || false,
          dummy: false,
        },
        deleted: 0,
      });
    } catch (error) {
      console.error(error);
    }
  });

  if (!customercategory) return <div>Loading...</div>;
  if (errorC) return <div>Error Loading...</div>;

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>New Customer</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="firstname" label="First Name" />
              <RHFTextField name="lastname" label="last Name" />

              <RHFTextField name="telephone" label="Phone Number" />
              <RHFTextField name="email" label="Email" />

              <RHFTextField name="cardno" label="Card No" />
              <RHFTextField name="taxid" label="Tax ID" />
            </Box>

            <RHFTextField name="address" label="Address" />

            <RHFTextField name="comments" label="Comments" />

            <Stack spacing={2} sx={{ p: 1 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Sex</Typography>
                <RHFRadioGroup
                  row
                  name="sex"
                  options={[
                    { label: "Male", value: 0 },
                    { label: "Female", value: 1 },
                    { label: "Other", value: 2 },
                  ]}
                />
              </Stack>

              <DatePicker
                name="dob"
                format="dd/MM/yyyy"
                label="Date of birth"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    // helperText: "Error",
                  },
                }}
              />
            </Stack>

            <RHFSelect
              native
              name="category_id"
              label={t("general.category")}
              InputLabelProps={{ shrink: true }}
            >
              <option key={0}>{t("general.dropdown_select")}</option>
              {customercategory.data.map((item: CustomerCategory) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </RHFSelect>

            <Stack spacing={0}>
              <RHFSwitch name="eventnotify" label="Event Notifications" />
              <RHFSwitch name="promonotify" label="Promotional Notifications" />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
