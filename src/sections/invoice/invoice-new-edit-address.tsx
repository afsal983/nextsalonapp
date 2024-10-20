import { useFormContext } from "react-hook-form";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import Iconify from "src/components/iconify";

import { BranchItem } from "src/types/branch";

import { BranchAddressListDialog } from "../branchaddress";
import { CustomerAddressListDialog } from "../customeraddress";

// ----------------------------------------------------------------------
type Props = {
  branches: BranchItem[];
};

export default function InvoiceNewEditAddress({ branches }: Props) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive("up", "md");

  const values = watch();

  const { invoiceTo, invoiceFrom } = values;

  const from = useBoolean();

  const to = useBoolean();

  return (
    <>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: "column", md: "row" }}
        divider={
          <Divider
            flexItem
            orientation={mdUp ? "vertical" : "horizontal"}
            sx={{ borderStyle: "dashed" }}
          />
        }
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: "text.disabled", flexGrow: 1 }}
            >
              From:
            </Typography>

            <IconButton onClick={from.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">{invoiceFrom?.name}</Typography>
            <Typography variant="body2">{invoiceFrom?.address}</Typography>
            <Typography variant="body2"> {invoiceFrom?.telephone}</Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: "text.disabled", flexGrow: 1 }}
            >
              To:
            </Typography>

            <IconButton onClick={to.onTrue}>
              <Iconify
                icon={invoiceTo ? "solar:pen-bold" : "mingcute:add-line"}
              />
            </IconButton>
          </Stack>

          {invoiceTo ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2">{invoiceTo.firstname}</Typography>
              <Typography variant="body2">{invoiceTo.address}</Typography>
              <Typography variant="body2"> {invoiceTo.telephone}</Typography>
            </Stack>
          ) : (
            <Typography typography="caption" sx={{ color: "error.main" }}>
              {(errors.invoiceTo as any)?.message}
            </Typography>
          )}
        </Stack>
      </Stack>

      <BranchAddressListDialog
        title="Branches"
        open={from.value}
        onClose={from.onFalse}
        selected={(selectedId: string) => invoiceFrom?.id === selectedId}
        onSelect={(address) => setValue("invoiceFrom", address)}
        list={branches}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: "flex-end" }}
          >
            New
          </Button>
        }
      />

      <CustomerAddressListDialog
        title="Customers"
        open={to.value}
        onClose={to.onFalse}
        selected={(selectedId: string) => invoiceTo?.id === selectedId}
        onSelect={(address) => setValue("invoiceTo", address)}
        list={[]}
        action={
          <Button
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ alignSelf: "flex-end" }}
          >
            New
          </Button>
        }
      />
    </>
  );
}
