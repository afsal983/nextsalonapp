import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { INVOICE_STATUS_OPTIONS } from 'src/_data';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

import { Printinvoice } from 'src/types/invoice';

import InvoiceToolbar from './invoice-toolbar';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  printinvoice: Printinvoice;
};

export default function InvoiceDetails({ printinvoice }: Props) {
  const [currentStatus, setCurrentStatus] = useState('paid');

  const handleChangeStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStatus(event.target.value);
  }, []);

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {printinvoice.subtotal}
        </TableCell>
      </StyledTableRow>

      {printinvoice.customersavings && (
        <StyledTableRow>
          <TableCell colSpan={5} />
          <TableCell sx={{ color: 'text.secondary' }}>Customer Savings</TableCell>
          <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
            {printinvoice.customersavings}
          </TableCell>
        </StyledTableRow>
      )}

      {printinvoice.discount && (
        <StyledTableRow>
          <TableCell colSpan={5} />
          <TableCell sx={{ color: 'text.secondary' }}>Overall discount</TableCell>
          <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
            {printinvoice.discount}
          </TableCell>
        </StyledTableRow>
      )}

      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>Tax Rate</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {printinvoice.taxrate}%
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>Tax Amount</TableCell>
        <TableCell width={120} sx={{ color: 'error.secondary', typography: 'body2' }}>
          {printinvoice.tax}
        </TableCell>
      </StyledTableRow>

      {printinvoice.tip && (
        <StyledTableRow>
          <TableCell colSpan={5} />
          <TableCell sx={{ color: 'text.secondary' }}>Tip</TableCell>
          <TableCell width={120} sx={{ color: 'error.secondary', typography: 'body2' }}>
            {printinvoice.tip}
          </TableCell>
        </StyledTableRow>
      )}

      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {printinvoice.billamount}
        </TableCell>
      </StyledTableRow>
      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ typography: 'subtitle1' }}>Rounded Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {printinvoice.nonroundedbillamount}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">We appreciate your business.</Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">support@smeeye.com</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Item</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Catgory</TableCell>

              <TableCell align="right">Price</TableCell>

              <TableCell align="right">Discounted Price</TableCell>

              <TableCell>Quantity</TableCell>

              <TableCell align="right">Sub Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {printinvoice.itemlist.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row[0]}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{row[1]}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="left">{row[5]}</TableCell>

                <TableCell align="right">{row[2]}</TableCell>

                <TableCell align="right">{row[6]}</TableCell>

                <TableCell>{row[3]}</TableCell>

                <TableCell align="right">{row[7]}</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <InvoiceToolbar
        printinvoice={printinvoice}
        currentStatus={currentStatus || 'Paid'}
        onChangeStatus={handleChangeStatus}
        statusOptions={INVOICE_STATUS_OPTIONS}
      />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src={printinvoice.logourl}
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={
                (currentStatus === 'paid' && 'success') ||
                (currentStatus === 'pending' && 'warning') ||
                (currentStatus === 'overdue' && 'error') ||
                'default'
              }
            >
              {currentStatus}
            </Label>

            <Typography variant="h6">{printinvoice.billno}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice From
            </Typography>
            {printinvoice.branchname}
            <br />
            {printinvoice.branchaddr}
            <br />
            Phone: {printinvoice.telephone}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice To
            </Typography>
            {printinvoice.guestname}
            <br />
            {printinvoice.guestaddress}
            <br />
            Phone: {printinvoice.guesttelephone}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date Create
            </Typography>
            {printinvoice.date}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Payment Method
            </Typography>
            {printinvoice.paymenttype}
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}
