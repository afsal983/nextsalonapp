import type { Theme, SxProps } from '@mui/material/styles';
import { useCallback } from 'react';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { type StackProps } from '@mui/material/Stack';

import { Iconify } from 'src/components/iconify';

import { type ServiceTableFilters } from 'src/types/service';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  onResetPage: () => void;
  filters: UseSetStateReturn<ServiceTableFilters>;
};

export default function ServiceTableFiltersResult({
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
      const newValue = filters.state.productcategory.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ productcategory: newValue });
    },
    [filters, onResetPage]
  );

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Service:" isShow={!!filters.state.productcategory.length}>
        {filters.state.productcategory.map((item) => (
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

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
