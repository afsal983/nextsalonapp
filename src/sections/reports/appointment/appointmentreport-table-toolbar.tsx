import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useSetState } from 'src/hooks/use-set-state';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { varAlpha } from 'minimal-shared/utils';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { usePopover } from 'minimal-shared/hooks';

import { AppointmentReportTableFilters } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<AppointmentReportTableFilters>;
  options: {
    branchOptions: {
      value: string;
      label: string;
    }[];
    statusOptions: {
      value: string;
      label: string;
    }[];
    sourceOptions: {
      value: string;
      label: string;
    }[];
  };
};

export default function AppointmentReportTableToolbar({ filters, options }: Props) {
  const popover = usePopover();

  const local = useSetState<AppointmentReportTableFilters>({
    branch: filters.state.branch,
    status: filters.state.status,
    sourcetype: filters.state.sourcetype,
  });

  const handleChangeBranch = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ branch: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ status: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleChangeSourcetype = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ sourcetype: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleFilterBranch = useCallback(() => {
    filters.setState({ branch: local.state.branch });
  }, [filters, local.state.branch]);

  const handleFilterStatus = useCallback(() => {
    filters.setState({ status: local.state.status });
  }, [filters, local.state.status]);

  const handleFilterSourceType = useCallback(() => {
    filters.setState({ sourcetype: local.state.sourcetype });
  }, [filters, local.state.sourcetype]);

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-stock-select-label">Branch</InputLabel>

        <Select
          multiple
          value={local.state.branch}
          onChange={handleChangeBranch}
          onClose={handleFilterBranch}
          input={<OutlinedInput label="Branxh" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-stock-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.branchOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.branch.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}
          <MenuItem
            onClick={handleFilterBranch}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-publish-select-label">Status</InputLabel>
        <Select
          multiple
          value={local.state.status}
          onChange={handleChangeStatus}
          onClose={handleFilterStatus}
          input={<OutlinedInput label="Publish" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-publish-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.status.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterStatus}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-publish-select-label">Payment Type</InputLabel>
        <Select
          multiple
          value={local.state.sourcetype}
          onChange={handleChangeSourcetype}
          onClose={handleFilterSourceType}
          input={<OutlinedInput label="Source Type" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-publish-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.sourceOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.sourcetype.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterSourceType}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
