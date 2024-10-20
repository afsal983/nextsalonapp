import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "src/hooks/use-boolean";

import { fCurrency } from "src/utils/format-number";
import { fDate, fTime } from "src/utils/format-time";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import { AppointmentItem } from "src/types/appointment";

// ----------------------------------------------------------------------

type Props = {
  row: AppointmentItem;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function AppointmentTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const {
    id,
    Additional_products,
    is_invoiced,
    start,
    end,
    Product,
    Customer,
    Employee,
    Branches_organization,
  } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          #{id}
        </Box>
      </TableCell>

      <TableCell sx={{ display: "flex", alignItems: "center" }}>
        {/* <Avatar alt={Customer.firstname} src={Customer.avatarUrl} sx={{ mr: 2 }} /> */}

        <ListItemText
          primary={Customer.firstname}
          secondary={Customer.email}
          primaryTypographyProps={{ typography: "body2" }}
          secondaryTypographyProps={{
            component: "span",
            color: "text.disabled",
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(start)}
          secondary={fTime(start)}
          primaryTypographyProps={{ typography: "body2", noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
          }}
        />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={fDate(end)}
          secondary={fTime(end)}
          primaryTypographyProps={{ typography: "body2", noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: "span",
            typography: "caption",
          }}
        />
      </TableCell>
      <TableCell align="center"> {Product.name} </TableCell>
      <TableCell align="center"> {Employee.name} </TableCell>
      <TableCell align="center"> {Branches_organization.name} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (is_invoiced && "success") ||
            (!is_invoiced && "warning") ||
            "default"
          }
        >
          {is_invoiced ? "Invoiced" : "Not Invoiced"}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: "nowrap" }}>
        <IconButton
          color={collapse.value ? "inherit" : "default"}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: "action.hover",
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton
          color={popover.open ? "inherit" : "default"}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: "none" }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: "background.neutral" }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {Additional_products?.map((item) => (
              <Stack
                key={item.id}
                direction="row"
                alignItems="center"
                sx={{
                  p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                  "&:not(:last-of-type)": {
                    borderBottom: (theme) =>
                      `solid 2px ${theme.palette.background.neutral}`,
                  },
                }}
              >
                {/*
                <Avatar
                  src={item.coverUrl}
                  variant="rounded"
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                */}
                <ListItemText
                  primary={item.Product.name}
                  secondary={item.Product.name}
                  primaryTypographyProps={{
                    typography: "body2",
                  }}
                  secondaryTypographyProps={{
                    component: "span",
                    color: "text.disabled",
                    mt: 0.5,
                  }}
                />

                <Box>x{item.Product.name}</Box>

                <Box sx={{ width: 110, textAlign: "right" }}>
                  {fCurrency(item.Product.name)}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
