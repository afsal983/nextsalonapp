import { useState, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { CustomerReportTableFilters, CustomerReportTableFilterValue } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  filters: CustomerReportTableFilters;
  onFilters: (name: string, value: CustomerReportTableFilterValue) => void;
  //
  categoryOptions: {
    value: string;
    label: string;
  }[];
  sexOptions: {
    value: string;
    label: string;
  }[];
};

export default function CustomerReportTableToolbar({
  filters,
  onFilters,
  //
  categoryOptions,
  sexOptions,
}: Props) {
  const popover = usePopover();

  const [category, setCategory] = useState<string[]>(filters.category);

  const [sex, setSex] = useState<string[]>(filters.sex);

  const handleChangeCategory = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setCategory(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangeSex = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSex(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleCloseCategory = useCallback(() => {
    onFilters('category', category);
  }, [onFilters, category]);

  const handleCloseSex = useCallback(() => {
    onFilters('sex', sex);
  }, [onFilters, sex]);

  return (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Category</InputLabel>

        <Select
          multiple
          value={category}
          onChange={handleChangeCategory}
          input={<OutlinedInput label="Category" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseCategory}
          sx={{ textTransform: 'capitalize' }}
        >
          {categoryOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={category?.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Sex</InputLabel>

        <Select
          multiple
          value={sex}
          onChange={handleChangeSex}
          input={<OutlinedInput label="Sex" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseSex}
          sx={{ textTransform: 'capitalize' }}
        >
          {sexOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={sex?.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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
      </CustomPopover>
    </>
  );
}
