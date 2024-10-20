import { useForm, Controller } from "react-hook-form";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";
import ListItemText from "@mui/material/ListItemText";
import FormControlLabel from "@mui/material/FormControlLabel";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";

import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";

import { type AppSettings } from "src/types/settings";
// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    subheader: "Customer Notifications",
    caption: "Different types of alerts to be sent to customers",
    items: [
      {
        id: "emailnotify",
        label: "Email customers for new events or updations",
      },
      {
        id: "whatsappnotify",
        label: "Whatsapp customers for new events or updations",
      },
      {
        id: "smsnotify",
        label: "Sent SMS to customers for new events or updations",
      },
    ],
  },
  /*
  {
    subheader: 'Application',
    caption: 'Donec mi odio, faucibus at, scelerisque quis',
    items: [
      { id: 'application_news', label: 'News and announcements' },
      { id: 'application_product', label: 'Weekly product updates' },
      { id: 'application_blog', label: 'Weekly blog digest' },
    ],
  },
  */
];

// ----------------------------------------------------------------------
interface Props {
  currentSettings: AppSettings[];
}

export default function AccountNotifications({ currentSettings }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const router = useRouter();

  const emailnotify =
    currentSettings.find((item) => item.name === "emailnotify")?.value || "";
  const whatsappnotify =
    currentSettings.find((item) => item.name === "whatsappnotify")?.value || "";
  const smsnotify =
    currentSettings.find((item) => item.name === "smsnotify")?.value || "";

  const methods = useForm({
    defaultValues: {
      selected: [emailnotify, whatsappnotify, smsnotify],
    },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

    const settings: AppSettings[] = [
      {
        id: 21,
        name: "emailnotify",
        value: data.selected.find((str) => str === "emailnotify"),
      },
      {
        id: 22,
        name: "whatsappnotify",
        value: data.selected.find((str) => str === "whatsappnotify"),
      },
      {
        id: 23,
        name: "smsnotify",
        value: data.selected.find((str) => str === "smsnotify"),
      },
    ];
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(responseData?.message, { variant: "error" });
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(t("general.update_success"));

        // Service listing again
        router.push(paths.dashboard.settings.root);
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  });

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        {NOTIFICATIONS.map((notification) => (
          <Grid key={notification.subheader} container spacing={3}>
            <Grid xs={12} md={4}>
              <ListItemText
                primary={notification.subheader}
                secondary={notification.caption}
                primaryTypographyProps={{ typography: "h6", mb: 0.5 }}
                secondaryTypographyProps={{ component: "span" }}
              />
            </Grid>

            <Grid xs={12} md={8}>
              <Stack
                spacing={1}
                sx={{ p: 3, borderRadius: 2, bgcolor: "background.neutral" }}
              >
                <Controller
                  name="selected"
                  control={control}
                  render={({ field }) => (
                    <>
                      {notification.items.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          label={item.label}
                          labelPlacement="start"
                          control={
                            <Switch
                              checked={field.value.includes(item.id)}
                              onChange={() =>
                                field.onChange(
                                  getSelected(values.selected, item.id)
                                )
                              }
                            />
                          }
                          sx={{
                            m: 0,
                            width: 1,
                            justifyContent: "space-between",
                          }}
                        />
                      ))}
                    </>
                  )}
                />
              </Stack>
            </Grid>
          </Grid>
        ))}

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ ml: "auto" }}
        >
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
