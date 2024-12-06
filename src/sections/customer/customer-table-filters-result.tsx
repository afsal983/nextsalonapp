import type { Theme, SxProps } from '@mui/material/styles';
import { useCallback } from 'react';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { type StackProps } from '@mui/material/Stack';

import { Iconify } from 'src/components/iconify';

import { type CustomerTableFilters } from 'src/types/customer';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<CustomerTableFilters>;
};

export default function CustomerTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  sx,
}: Props) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveProductCategory = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.customercategory.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ customercategory: newValue });
    },
    [filters, onResetPage]
  );

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);
  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Service:" isShow={!!filters.state.customercategory.length}>
        {filters.state.customercategory.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveProductCategory(item)}
          />
        ))}
      </FiltersBlock>

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
