import { useState, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ExpenseReportTableFilters, ExpenseReportTableFilterValue } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  filters: ExpenseReportTableFilters;
  onFilters: (name: string, value: ExpenseReportTableFilterValue) => void;
  //
  branchOptions: {
    value: string;
    label: string;
  }[];
  statusOptions: {
    value: string;
    label: string;
  }[];
  paymentOptions: {
    value: string;
    label: string;
  }[];
};

export default function ExpenseReportTableToolbar({
  filters,
  onFilters,
  //
  branchOptions,
  statusOptions,
  paymentOptions,
}: Props) {
  const popover = usePopover();

  const [branch, setBranch] = useState<string[]>(filters.branch);

  const [status, setStatus] = useState<string[]>(filters.status);

  const [paymenttype, setPaymenttype] = useState<string[]>(filters.paymenttype);

  const handleChangeBranch = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setBranch(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangeStatus = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setStatus(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangePaymenttype = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setPaymenttype(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleCloseBranch = useCallback(() => {
    onFilters('branch', branch);
  }, [onFilters, branch]);

  const handleCloseStatus = useCallback(() => {
    onFilters('status', status);
  }, [onFilters, status]);

  const handleClosePaymenttype = useCallback(() => {
    onFilters('paymenttype', paymenttype);
  }, [onFilters, paymenttype]);

  return (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Branch</InputLabel>

        <Select
          multiple
          value={branch}
          onChange={handleChangeBranch}
          input={<OutlinedInput label="Branch" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseBranch}
          sx={{ textTransform: 'capitalize' }}
        >
          {branchOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={branch?.includes(option.value)} />
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
        <InputLabel>Status</InputLabel>

        <Select
          multiple
          value={status}
          onChange={handleChangeStatus}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseStatus}
          sx={{ textTransform: 'capitalize' }}
        >
          {statusOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={status?.includes(option.value)} />
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
        <InputLabel>Payment Type</InputLabel>

        <Select
          multiple
          value={paymenttype}
          onChange={handleChangePaymenttype}
          input={<OutlinedInput label="Payment Type" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleClosePaymenttype}
          sx={{ textTransform: 'capitalize' }}
        >
          {paymentOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={paymenttype?.includes(option.value)} />
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
