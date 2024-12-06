import { useCallback } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { type StackProps } from '@mui/material/Stack';

import { Iconify } from 'src/components/iconify';

import { type PaymentTypeTableFilters } from 'src/types/paymenttype';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<PaymentTypeTableFilters>;
};

export default function PaymentTypeTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  sx,
}: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);
  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
