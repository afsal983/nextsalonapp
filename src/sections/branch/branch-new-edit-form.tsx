import * as Yup from "yup";
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
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

import { type BranchItem } from "src/types/branch";
import { type LocationItem } from "src/types/location";
import { type OrganizationItem } from "src/types/organization";

// ----------------------------------------------------------------------

interface Props {
  currentBranch?: BranchItem;
  organization: OrganizationItem[];
  location: LocationItem[];
}

export default function BranchNewEditForm({
  currentBranch,
  organization,
  location,
}: Props) {
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

  console.log(currentBranch);
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required(t("salonapp.branch.name_fvalid_error")),
    reg_name: Yup.string().required(t("salonapp.branch.reg_fvalid_error")),
    address: Yup.string(),
    telephone: Yup.string(),
    taxid: Yup.string(),
    org_id: Yup.number().required(t("salonapp.branch.orgid_fvalid_error")),
    loc_id: Yup.number().required(t("salonapp.branch.locid_fvalid_error")),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentBranch?.branch_id || "0",
      name: currentBranch?.name || "",
      reg_name: currentBranch?.reg_name || "",
      address: currentBranch?.address || "",
      telephone: currentBranch?.telephone || "",
      taxid: currentBranch?.taxid || "",
      org_id: currentBranch?.org_id || 0,
      loc_id: currentBranch?.loc_id || 0,
    }),
    [currentBranch]
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
    const BranchData = {
      branch_id: currentBranch?.branch_id,
      name: data.name,
      reg_name: data.reg_name,
      address: data.address,
      telephone: data.telephone,
      taxid: data.taxid,
      org_id: data.org_id,
      loc_id: data.loc_id,
    };
    console.log(BranchData);
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/branches`, {
        method: currentBranch ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(BranchData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(
          currentBranch
            ? `${t("general.update_failed")}:${responseData.message}`
            : `${t("general.create_failed")}:${responseData.message}`,
          { variant: "error" }
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(
          currentBranch
            ? t("general.update_success")
            : t("general.create_success"),
          { variant: "success" }
        );

        // Service listing again
        router.push(paths.dashboard.branches.list);
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
                label={t("salonapp.branch.brname")}
                helperText={t("salonapp.branch.bn_helper")}
              />
              <RHFTextField
                name="reg_name"
                label={t("salonapp.branch.regname")}
                helperText={t("salonapp.branch.rn_helper")}
              />
              <RHFTextField
                name="address"
                label={t("salonapp.branch.address")}
                helperText={t("salonapp.branch.add_helper")}
              />
              <RHFTextField
                name="telephone"
                label={t("salonapp.branch.telephone")}
                helperText={t("salonapp.branch.tp_helper")}
              />
              <RHFTextField
                name="taxid"
                label={t("salonapp.branch.taxid")}
                helperText={t("salonapp.branch.ti_helper")}
              />
              <RHFSelect
                native
                name="org_id"
                label={t("salonapp.branch.orgname")}
                InputLabelProps={{ shrink: true }}
              >
                <option key={0}>{t("general.dropdown_select")}</option>
                {organization.map((item) => (
                  <option key={item.org_id} value={item.org_id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="loc_id"
                label={t("salonapp.branch.locname")}
                InputLabelProps={{ shrink: true }}
              >
                <option key={0}>{t("general.dropdown_select")}</option>
                {location.map((item) => (
                  <option key={item.loc_id} value={item.loc_id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentBranch
                  ? t("salonapp.branch.create_branch")
                  : t("salonapp.branch.save_branch")}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
