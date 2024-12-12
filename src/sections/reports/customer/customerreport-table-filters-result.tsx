import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { CustomerReportTableFilters } from 'src/types/report';
// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<CustomerReportTableFilters>;
};

export default function AppointmentReportTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveCategory = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.category.filter((item) => item !== inputValue);

      filters.setState({ category: newValue });
    },
    [filters]
  );

  const handleRemoveSex = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.sex.filter((item) => item !== inputValue);

      filters.setState({ sex: newValue });
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

      <FiltersBlock label="Sex:" isShow={!!filters.state.sex.length}>
        {filters.state.sex.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveSex(item)} />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
