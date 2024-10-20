import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import Card, { type CardProps } from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";

import { fCurrency } from "src/utils/format-number";

import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";

// ----------------------------------------------------------------------

interface RowProps {
  id: string;
  name: string;
  revenue: string;
  amount: string;
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
              {tableData.map((row, index) => (
                <EcommerceBestSalesmanRow key={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface EcommerceBestSalesmanRowProps {
  row: RowProps;
}

function EcommerceBestSalesmanRow({ row }: EcommerceBestSalesmanRowProps) {
  return (
    <TableRow>
      <TableCell sx={{ display: "flex", alignItems: "center" }}>
        {row.name}
      </TableCell>

      <TableCell align="right">{fCurrency(row.revenue)}</TableCell>

      <TableCell align="right">{row.amount}</TableCell>
    </TableRow>
  );
}
