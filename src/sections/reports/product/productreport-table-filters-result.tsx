import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { ProductReportTableFilters } from 'src/types/report';
// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<ProductReportTableFilters>;
};

export default function ProductReportTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveCategory = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.category.filter((item) => item !== inputValue);

      filters.setState({ category: newValue });
    },
    [filters]
  );

  const handleRemoveType = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.type.filter((item) => item !== inputValue);

      filters.setState({ type: newValue });
    },
    [filters]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Category:" isShow={!!filters.state.category.length}>
        {filters.state.category.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveCategory(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Type:" isShow={!!filters.state.type.length}>
        {filters.state.type.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveType(item)} />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
