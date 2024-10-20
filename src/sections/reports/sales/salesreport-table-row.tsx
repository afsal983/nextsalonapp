import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";

import { useBoolean } from "src/hooks/use-boolean";

import { fCurrency } from "src/utils/format-number";
import { fDate, fTime } from "src/utils/format-time";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

type Props = {
  row: any;
};

export default function SalesReportTableRow({ row }: Props) {
  const {
    serial,
    invoicenumber,
    date,
    invoicevalue,
    tax,
    taxby2,
    billingname,
    branchname,
    status,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow>
        <TableCell />
        <TableCell>{serial}</TableCell>
        <TableCell>{invoicenumber}</TableCell>
        <TableCell>{date}</TableCell>
        <TableCell>{invoicevalue}</TableCell>
        <TableCell>{taxby2}</TableCell>
        <TableCell>{taxby2}</TableCell>
        <TableCell>{tax}</TableCell>
        <TableCell>{billingname}</TableCell>
        <TableCell>{branchname}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (status === "paid" && "success") ||
              (status === "pending" && "warning") ||
              (status === "overdue" && "error") ||
              "default"
            }
          >
            {status}
          </Label>
        </TableCell>
      </TableRow>
    </>
  );
}
