import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { LoadingButton } from '@mui/lab';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { Iconify } from 'src/components/iconify';

import { ProductReportPeriodFilters } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  canReset: boolean;
  dateError: boolean;
  onClose: () => void;
  colorOptions: string[];
  filters: UseSetStateReturn<ProductReportPeriodFilters>;
  handleSearch: () => void;
};

export default function PeriodFilters({
  open,
  onClose,
  filters,
  canReset,
  dateError,
  colorOptions,
  handleSearch,
}: Props) {
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
        <IconButton onClick={filters.onResetState}>
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
      <Typography variant="subtitle2">Range</Typography>

      <Stack spacing={2}>
        <LoadingButton
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          onClick={() => {
            handleSearch();
          }}
          sx={{ my: 2.5 }}
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
