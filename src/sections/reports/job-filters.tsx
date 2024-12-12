import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ReportFilters } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  canReset: boolean;
  onOpen: () => void;
  onClose: () => void;
  filters: UseSetStateReturn<ReportFilters>;
  options: {
    roles: string[];
    benefits: string[];
    experiences: string[];
    employmentTypes: string[];
  };
};

export default function JobFilters({ open, canReset, onOpen, onClose, filters, options }: Props) {
  const handleFilterEmploymentTypes = useCallback(
    (newValue: string) => {
      const checked = filters.state.name.includes(newValue)
        ? filters.state.name.filter((value) => value !== newValue)
        : [...filters.state.name, newValue];

      filters.setState({ name: checked });
    },
    [filters]
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

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3} />
        </Scrollbar>
      </Drawer>
    </>
  );
}
