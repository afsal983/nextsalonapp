import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { varAlpha } from 'minimal-shared/utils';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import type { ICalendarFilters } from 'src/types/calendar';

// ----------------------------------------------------------------------

type Props = StackProps & {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<ICalendarFilters>;
};

export default function CalendarFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveColor = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.colors.filter((item) => item !== inputValue);

      filters.setState({ colors: newValue });
    },
    [filters]
  );

  const handleRemoveDate = useCallback(() => {
    filters.setState({ startDate: null, endDate: null });
  }, [filters]);
  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Colors:" isShow={!!filters.state.colors.length}>
        {filters.state.colors.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={
              <Box
                sx={{
                  ml: -0.5,
                  width: 18,
                  height: 18,
                  bgcolor: item,
                  borderRadius: '50%',
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.24)}`,
                }}
              />
            }
            onDelete={() => handleRemoveColor(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock
        label="Date:"
        isShow={Boolean(filters.state.startDate && filters.state.endDate)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(filters.state.startDate, filters.state.endDate)}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
