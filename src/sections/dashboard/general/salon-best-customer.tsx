import { Avatar } from "@mui/material";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import ListItem from "@mui/material/ListItem";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CardHeader from "@mui/material/CardHeader";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Card, { type CardProps } from "@mui/material/Card";
import TableContainer from "@mui/material/TableContainer";

import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";

// ----------------------------------------------------------------------

interface RowProps {
  id: string;
  customer: string;
  telephone: string;
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

export default function SalonBestCustomer({
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
                <EcommerceBestCsutomerRow key={index} row={row} rank={index} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

interface EcommerceBestCsutomerRowProps {
  row: RowProps;
  rank: number;
}

function EcommerceBestCsutomerRow({
  row,
  rank,
}: EcommerceBestCsutomerRowProps) {
  return (
    <TableRow>
      <TableCell sx={{ display: "flex", alignItems: "center" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar sx={{ mr: 2 }}>{row.customer.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{ typography: "body2", noWrap: true }}
            secondaryTypographyProps={{
              component: "span",
              typography: "caption",
            }}
            primary={row.customer}
            secondary={row.telephone}
          />
        </ListItem>
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
