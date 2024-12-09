import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import { Iconify } from 'src/components/iconify';

import { AppointmentReportTableFilters, AppointmentReportTableFilterValue } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: AppointmentReportTableFilters;
  onFilters: (name: string, value: AppointmentReportTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function AppointmentReportTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveBranch = useCallback(
    (inputValue: string) => {
      const newValue = filters.branch.filter((item) => item !== inputValue);

      onFilters('branch', newValue);
    },
    [filters.branch, onFilters]
  );

  const handleRemoveStatus = useCallback(
    (inputValue: string) => {
      const newValue = filters.status.filter((item) => item !== inputValue);

      onFilters('status', newValue);
    },
    [filters.status, onFilters]
  );

  const handleRemovesourcetype = useCallback(
    (inputValue: string) => {
      const newValue = filters.status.filter((item) => item !== inputValue);

      onFilters('sourcetype', newValue);
    },
    [filters.status, onFilters]
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
        {!!filters.branch.length && (
          <Block label="Branch:">
            {filters.branch.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveBranch(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.status.length && (
          <Block label="Status:">
            {filters.status.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveStatus(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.sourcetype.length && (
          <Block label="Source Type:">
            {filters.sourcetype.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemovesourcetype(item)}
              />
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
