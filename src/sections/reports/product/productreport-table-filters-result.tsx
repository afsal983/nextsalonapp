import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import { Iconify } from 'src/components/iconify';

import { ProductReportTableFilters, ProductReportTableFilterValue } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: ProductReportTableFilters;
  onFilters: (name: string, value: ProductReportTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function ProductReportTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveCategory = useCallback(
    (inputValue: string) => {
      const newValue = filters.category.filter((item) => item !== inputValue);

      onFilters('category', newValue);
    },
    [filters.category, onFilters]
  );

  const handleRemoveType = useCallback(
    (inputValue: string) => {
      const newValue = filters.type.filter((item) => item !== inputValue);

      onFilters('type', newValue);
    },
    [filters.type, onFilters]
  );

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.category.length && (
          <Block label="Branch:">
            {filters.category.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveCategory(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.type.length && (
          <Block label="Type:">
            {filters.type.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveType(item)} />
            ))}
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
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
