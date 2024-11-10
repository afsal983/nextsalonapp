import { useState, useCallback } from "react";

import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";

import {
  AppointmentReportTableFilters,
  AppointmentReportTableFilterValue,
} from "src/types/report";

// ----------------------------------------------------------------------

type Props = {
  filters: AppointmentReportTableFilters;
  onFilters: (name: string, value: AppointmentReportTableFilterValue) => void;
  //
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

export default function AppointmentReportTableToolbar({
  filters,
  onFilters,
  //
  branchOptions,
  statusOptions,
  sourceOptions,
}: Props) {
  const popover = usePopover();

  const [branch, setBranch] = useState<string[]>(filters.branch);

  const [status, setStatus] = useState<string[]>(filters.status);

  const [sourcetype, setSourcetype] = useState<string[]>(filters.sourcetype);

  const handleChangeBranch = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setBranch(typeof value === "string" ? value.split(",") : value);
    },
    []
  );

  const handleChangeStatus = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setStatus(typeof value === "string" ? value.split(",") : value);
    },
    []
  );

  const handleChangeSourcetype = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setSourcetype(typeof value === "string" ? value.split(",") : value);
    },
    []
  );

  const handleCloseBranch = useCallback(() => {
    onFilters("branch", branch);
  }, [onFilters, branch]);

  const handleCloseStatus = useCallback(() => {
    onFilters("status", status);
  }, [onFilters, status]);

  const handleCloseSourcetype = useCallback(() => {
    onFilters("sourcetype", sourcetype);
  }, [onFilters, sourcetype]);

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
          renderValue={(selected) => selected.map((value) => value).join(", ")}
          onClose={handleCloseBranch}
          sx={{ textTransform: "capitalize" }}
        >
          {branchOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={branch?.includes(option.value)}
              />
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
          renderValue={(selected) => selected.map((value) => value).join(", ")}
          onClose={handleCloseStatus}
          sx={{ textTransform: "capitalize" }}
        >
          {statusOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={status?.includes(option.value)}
              />
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
        <InputLabel>Source Type</InputLabel>

        <Select
          multiple
          value={sourcetype}
          onChange={handleChangeSourcetype}
          input={<OutlinedInput label="Source Type" />}
          renderValue={(selected) => selected.map((value) => value).join(", ")}
          onClose={handleCloseSourcetype}
          sx={{ textTransform: "capitalize" }}
        >
          {sourceOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={sourcetype?.includes(option.value)}
              />
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
