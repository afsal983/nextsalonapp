import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type RowProps = {
  id: string;
  invoicenumber: string;
  billingname: string;
  telephone: string;
  employeename: string;
  total: string;
  date: string;
  paymentstatus: string;
  paymentmethod: string;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: RowProps[];
}

export default function LatestTransactions({
  title,
  subheader,
  tableLabels,
  tableData,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData?.map((row) => <LatestTransactionsRow key={row.id} row={row} />)}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type LatestTransactionsRowProps = {
  row: RowProps;
};

function LatestTransactionsRow({ row }: LatestTransactionsRowProps) {
  const theme = useTheme();

  const lightMode = theme.palette.mode === 'light';

  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('DOWNLOAD', row.id);
  };

  const handlePrint = () => {
    popover.onClose();
    console.info('PRINT', row.id);
  };

  const handleShare = () => {
    popover.onClose();
    console.info('SHARE', row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Chip
            label={row.invoicenumber}
            color="success"
            component="a"
            href={`/dashboard/invoice/${row.id}/`}
            clickable
            icon={<Iconify icon="uil:invoice" width={18} sx={{ ml: -0.5 }} />}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.billingname}
            secondary={row.telephone}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          {row.employeename.length > 1 ? (
            <>
              {row.employeename[0]}
              <Typography variant="body2" color="textSecondary">
                and more
              </Typography>
            </>
          ) : (
            row.employeename[0]
          )}
        </TableCell>

        <TableCell>
          <ListItemText
            primary={row.date.split(' ')[0]}
            secondary={row.date.split(' ')[1]}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{fCurrency(row.total)}</TableCell>

        <TableCell>
          <Label
            variant={lightMode ? 'soft' : 'filled'}
            color={
              (row.paymentstatus === 'Paid' && 'success') ||
              (row.paymentstatus === 'Pending' && 'warning') ||
              'error'
            }
          >
            {row.paymentstatus}
          </Label>
        </TableCell>

        <TableCell>{row.paymentmethod}</TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
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

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
