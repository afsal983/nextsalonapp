import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { ListItem } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import GoogleIcon from "@mui/icons-material/Google";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FacebookIcon from "@mui/icons-material/Facebook";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import LinearProgress from "@mui/material/LinearProgress";
import ListItemButton from "@mui/material/ListItemButton";
import InstagramIcon from "@mui/icons-material/Instagram";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

import Label from "src/components/label";

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label
      variant="soft"
      color={(params.row.publish === "published" && "info") || "default"}
    >
      {params.row.publish}
    </Label>
  );
}

export function RenderCellStartAt({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.start.date}
      secondary={params.row.start.time}
      primaryTypographyProps={{ typography: "body2", noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: "span",
        typography: "caption",
      }}
    />
  );
}

export function RenderCellEndAt({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.end.date}
      secondary={params.row.end.time}
      primaryTypographyProps={{ typography: "body2", noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: "span",
        typography: "caption",
      }}
    />
  );
}

export function RenderCellBookingSource({ params }: ParamsProps) {
  return (
    <Stack sx={{ typography: "caption", color: "text.secondary" }}>
      <ListItem key={params.row.bookingsource} disablePadding>
        <ListItemButton>
          <ListItemIcon>
            {(params.row.inventoryType === "admin" && (
              <SupervisorAccountIcon color="error" />
            )) ||
              (params.row.inventoryType === "Whatsapp" && (
                <SupervisorAccountIcon />
              )) ||
              (params.row.inventoryType === "Google Business" && (
                <GoogleIcon />
              )) ||
              (params.row.inventoryType === "FaceBook" && <FacebookIcon />) ||
              (params.row.inventoryType === "Instagram" && <InstagramIcon />) ||
              (params.row.inventoryType === "Website" && <WebAssetIcon />) ||
              (params.row.inventoryType === "Mobile Apps" && (
                <MobileFriendlyIcon />
              )) || <SupervisorAccountIcon />}
          </ListItemIcon>
          <ListItemText
            id={params.row.bookingsource}
            primary={params.row.bookingsource}
          />
        </ListItemButton>
      </ListItem>
    </Stack>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack sx={{ typography: "caption", color: "text.secondary" }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === "out of stock" && "error") ||
          (params.row.inventoryType === "low stock" && "warning") ||
          "success"
        }
        sx={{ mb: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available}{" "}
      {params.row.inventoryType}
    </Stack>
  );
}

export function RenderCellCustomer({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
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
            {params.row.customerinfo.name}
          </Link>
        }
        secondary={
          <Box
            component="div"
            sx={{ typography: "body2", color: "text.disabled" }}
          >
            {params.row.customerinfo.email}
          </Box>
        }
        sx={{ display: "flex", flexDirection: "column" }}
      />
    </Stack>
  );
}
