import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { GridCellParams } from "@mui/x-data-grid";
import ListItemText from "@mui/material/ListItemText";
import LinearProgress from "@mui/material/LinearProgress";
import { Chip, Avatar } from "@mui/material";
import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return <>{fCurrency(params.row.price)}</>;
}

export function RenderCellEventNotify({ params }: ParamsProps) {
  return (
    <Stack
      sx={{ typography: "caption", color: "text.secondary" }}
      direction="row"
      spacing={1}
    >
      {(params.row.eventnotify === "Yes" && (
        <Iconify color="primary" icon="healthicons:yes-outline" />
      )) ||
        (params.row.eventnotify === "No" && (
          <Iconify color="error" icon="healthicons:no-outline" />
        ))}
      {params.row.eventnotify}
    </Stack>
  );
}

export function RenderCellPromoNotify({ params }: ParamsProps) {
  return (
    <Stack
      sx={{ typography: "caption", color: "text.secondary" }}
      direction="row"
      spacing={1}
    >
      {(params.row.promonotify === "Yes" && (
        <Iconify color="primary" icon="healthicons:yes-outline" />
      )) ||
        (params.row.promonotify === "No" && (
          <Iconify color="error" icon="healthicons:no-outline" />
        ))}
      {params.row.promonotify}
    </Stack>
  );
}

export function RenderCellSex({ params }: ParamsProps) {
  return (
    <Stack sx={{ typography: "caption", color: "text.secondary" }}>
      <Chip
        color={
          (params.row.sex === "Female" && "success") ||
          (params.row.sex === "Male" && "warning") ||
          "error"
        }
        label={params.row.sex}
      />
    </Stack>
  );
}

export function RenderCellProduct({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar color="primary" sx={{ mx: 1 }}>
        {params.row.productinfo.name.charAt(0)}
      </Avatar>
      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            // onClick={params.row.item.onViewRow}
            sx={{ cursor: "pointer" }}
          >
            {params.row.productinfo.name}
          </Link>
        }
        secondary={
          <Box
            component="div"
            sx={{ typography: "body2", color: "text.disabled" }}
          >
            {params.row.productinfo.telephone}
          </Box>
        }
        sx={{ display: "flex", flexDirection: "column" }}
      />
    </Stack>
  );
}