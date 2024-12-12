import { useCallback } from 'react';

import Chip from '@mui/material/Chip';
import { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { AppointmentReportTableFilters } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<AppointmentReportTableFilters>;
};

export default function AppointmentReportTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveBranch = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.branch.filter((item) => item !== inputValue);

      filters.setState({ branch: newValue });
    },
    [filters]
  );

  const handleRemoveStatus = useCallback(() => {
    filters.setState({ status: ['all'] });
  }, [filters]);

  const handleRemoveSourcetype = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.sourcetype.filter((item) => item !== inputValue);

      filters.setState({ sourcetype: newValue });
    },
    [filters]
  );
  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Branch:" isShow={!!filters.state.branch.length}>
        {filters.state.branch.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveBranch(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={!!filters.state.status.length}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Source Type:" isShow={!!filters.state.sourcetype.length}>
        {filters.state.sourcetype.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={item}
            onDelete={() => handleRemoveSourcetype(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
