import Chip from '@mui/material/Chip';
import type { Theme, SxProps } from '@mui/material/styles';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import type { ReportFilters } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<ReportFilters>;
};

export default function InvoiceTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveKeyWord = (inputValue: string) => {
    const newValue = filters.state.name.filter((item) => item !== inputValue);
    filters.setState({ name: newValue });
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Name:" isShow={!!filters.state.name.length}>
        {filters.state.name.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveKeyWord(item)} />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
