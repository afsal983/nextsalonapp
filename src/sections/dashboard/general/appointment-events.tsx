import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import Card, { CardProps } from "@mui/material/Card";
import ListItemText from "@mui/material/ListItemText";
import Badge, { badgeClasses } from "@mui/material/Badge";
import TableContainer from "@mui/material/TableContainer";

import { fDate, fTime } from "src/utils/format-time";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  start: string;
  end: string;
  name: number;
  type: string;
  telephone: string;
  product: string;
  employee: string | null;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: RowProps[];
  tableLabels: any;
}

export default function AppointmentEvents({
  title,
  subheader,
  tableLabels,
  tableData,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData?.map((row) => (
                <BankingRecentTransitionsRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          endIcon={
            <Iconify
              icon="eva:arrow-ios-forward-fill"
              width={18}
              sx={{ ml: -0.5 }}
            />
          }
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type BankingRecentTransitionsRowProps = {
  row: RowProps;
};

function BankingRecentTransitionsRow({
  row,
}: BankingRecentTransitionsRowProps) {
  const theme = useTheme();

  // const lightMode = theme.palette.mode === "light";

  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info("DOWNLOAD", row.id);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info("PRINT", row.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info("SHARE", row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info("DELETE", row.id);
  };

  const renderAvatar = (
    <Box sx={{ position: "relative", mr: 2 }}>
      <Badge
        overlap="circular"
        color={row.type === "Income" ? "success" : "error"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <Iconify
            icon={
              row.type === "Income"
                ? "eva:diagonal-arrow-left-down-fill"
                : "eva:diagonal-arrow-right-up-fill"
            }
            width={16}
          />
        }
        sx={{
          [`& .${badgeClasses.badge}`]: {
            p: 0,
            width: 20,
          },
        }}
      >
        {/*
        <Avatar
          src={row?.avatarUrl || ""}
          sx={{
            width: 48,
            height: 48,
            color: "text.secondary",
            bgcolor: "background.neutral",
          }}
        >
          {row.product === "Books" && (
            <Iconify icon="eva:book-fill" width={24} />
          )}
          {row.product === "Beauty & Health" && (
            <Iconify icon="solar:heart-bold" width={24} />
          )}
        </Avatar>
          */}
      </Badge>
    </Box>
  );

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: "flex", alignItems: "center" }}>
          {renderAvatar}
          <ListItemText primary={row.name} secondary={row.telephone} />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(new Date(row.start))}
            secondary={fTime(new Date(row.start))}
            primaryTypographyProps={{ typography: "body2" }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: "span",
              typography: "caption",
            }}
          />
        </TableCell>

        <TableCell>{row.product}</TableCell>
        <TableCell align="right">{row.employee}</TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
