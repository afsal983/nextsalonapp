import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { LoadingButton } from '@mui/lab';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

import { Iconify } from 'src/components/iconify';

import { CustomerReportPeriodFilters, CustomerReportPeriodFilterValue } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  //
  filters: CustomerReportPeriodFilters;
  onFilters: (name: string, value: CustomerReportPeriodFilterValue) => void;
  handleSearch: () => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  dateError: boolean;
  //
  open: boolean;
  onClose: VoidFunction;
  //
  // events: ICalendarEvent[];
  colorOptions: string[];
  // onClickEvent: (eventId: string) => void;
  isLoading: boolean;
};

export default function PeriodFilters({
  open,
  onClose,
  handleSearch,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  dateError,
  //
  // events,
  colorOptions, // onClickEvent,
  isLoading,
}: Props) {
  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderDateRange = (
    <Stack spacing={1.5} sx={{ mb: 3, px: 2.5 }}>
      <Stack spacing={2}>
        {/*
        <DatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
        />

        <DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError && "End date must be later than start date",
            },
          }}
        />
        */}

        <LoadingButton
          variant="contained"
          loading={isLoading}
          size="large"
          startIcon={<SearchIcon />}
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </LoadingButton>
      </Stack>
    </Stack>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      {renderHead}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDateRange}
    </Drawer>
  );
}
