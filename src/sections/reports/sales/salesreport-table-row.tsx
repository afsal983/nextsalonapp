import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import { useBoolean } from "src/hooks/use-boolean";

import Label from "src/components/label";
import { usePopover } from "src/components/custom-popover";

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
  );
}
