import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return <>{fCurrency(params.row.total)}</>;
}
export function RenderCellTax({ params }: ParamsProps) {
  return <>{fCurrency(params.row.tax)}</>;
}
export function RenderCellTaxby2({ params }: ParamsProps) {
  return <>{fCurrency(params.row.taxby2)}</>;
}

export function RenderCellUnitPrice({ params }: ParamsProps) {
  return <>{fCurrency(params.row.unitprice)}</>;
}

export function RenderCellDiscount({ params }: ParamsProps) {
  return <>{fCurrency(params.row.discount)}</>;
}

export function RenderBillingName({ params }: ParamsProps) {
  return <>{params.row.billingname}</>;
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label variant="soft" color={(params.row.publish === 'published' && 'info') || 'default'}>
      {params.row.publish}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={params.row.createdat.date}
      secondary={params.row.createdat.time}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={(params.row.available * 100) / params.row.quantity}
        variant="determinate"
        color={
          (params.row.inventoryType === 'out of stock' && 'error') ||
          (params.row.inventoryType === 'low stock' && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, maxWidth: 80 }}
      />
      {!!params.row.available && params.row.available} {params.row.inventoryType}
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
            sx={{ cursor: 'pointer' }}
          >
            {params.row.billinginfo.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.billinginfo.category}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
