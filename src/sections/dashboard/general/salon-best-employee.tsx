import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Label from "src/components/label";
import CardHeader from "@mui/material/CardHeader";
import Card, { type CardProps } from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";

import { fCurrency } from "src/utils/format-number";

import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";

// ----------------------------------------------------------------------

interface RowProps {
  id: string;
  employee: string;
  revenue: string;
  amount: string;
  rank: string;
}

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: RowProps[];
  tableLabels: any;
}

export default function SalonBestEmployee({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 640 }}>
            <TableHeadCustom headLabel={tableLabels} />
            <TableBody>
              {tableData?.map((row, index) => (
                <EcommerceEmployeeRow key={index} row={row} rank={index} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface EcommerceBestEmployeeRowProps {
  row: RowProps;
  rank: number;
}

function EcommerceEmployeeRow({ row, rank }: EcommerceBestEmployeeRowProps) {
  return (
    <TableRow>
      <TableCell sx={{ display: "flex", alignItems: "center" }}>
        {row.employee}
      </TableCell>

      <TableCell align="center">{fCurrency(row.revenue)}</TableCell>

      <TableCell align="center">{row.amount}</TableCell>
      <TableCell align="right">
        <Label
          variant="soft"
          color={
            (rank === 0 && "primary") ||
            (rank === 1 && "info") ||
            (rank === 2 && "success") ||
            (rank === 3 && "warning") ||
            "error"
          }
        >
          {rank + 1}
        </Label>
      </TableCell>
    </TableRow>
  );
}
