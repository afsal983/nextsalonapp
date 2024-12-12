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

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { CustomerReportTableFilters } from 'src/types/report';

// ----------------------------------------------------------------------
type Props = {
  filters: UseSetStateReturn<CustomerReportTableFilters>;
  options: {
    categoryOptions: {
      value: string;
      label: string;
    }[];
    sexOptions: {
      value: string;
      label: string;
    }[];
  };
};

export default function CustomerReportTableToolbar({ filters, options }: Props) {
  const popover = usePopover();

  const local = useSetState<CustomerReportTableFilters>({
    category: filters.state.category,
    sex: filters.state.sex,
  });

  const handleChangeCategory = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ category: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleChangeSex = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ sex: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleFilterCategory = useCallback(() => {
    filters.setState({ category: local.state.category });
  }, [filters, local.state.category]);

  const handleFilterSex = useCallback(() => {
    filters.setState({ sex: local.state.sex });
  }, [filters, local.state.sex]);

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-stock-select-label">Branch</InputLabel>

        <Select
          multiple
          value={local.state.category}
          onChange={handleChangeCategory}
          onClose={handleFilterCategory}
          input={<OutlinedInput label="Category" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-stock-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.category.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}
          <MenuItem
            onClick={handleFilterCategory}
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
        <InputLabel htmlFor="product-filter-publish-select-label">Sex</InputLabel>
        <Select
          multiple
          value={local.state.sex}
          onChange={handleChangeSex}
          onClose={handleFilterSex}
          input={<OutlinedInput label="Sex" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-publish-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.sexOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.sex.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterSex}
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
