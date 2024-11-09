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
  ProductReportTableFilters,
  ProductReportTableFilterValue,
} from "src/types/report";

// ----------------------------------------------------------------------

type Props = {
  filters: ProductReportTableFilters;
  onFilters: (name: string, value: ProductReportTableFilterValue) => void;
  //
  categoryOptions: {
    value: string;
    label: string;
  }[];
  typeOptions: {
    value: string;
    label: string;
  }[];
};

export default function ProductReportTableToolbar({
  filters,
  onFilters,
  //
  categoryOptions,
  typeOptions,
}: Props) {
  const popover = usePopover();

  const [category, setCategory] = useState<string[]>(filters.category);

  const [type, setType] = useState<string[]>(filters.type);

  const handleChangeCategory = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      setCategory(typeof value === "string" ? value.split(",") : value);
    },
    []
  );

  const handleChangeType = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setType(typeof value === "string" ? value.split(",") : value);
  }, []);

  const handleCloseCategory = useCallback(() => {
    onFilters("category", category);
  }, [onFilters, category]);

  const handleCloseType = useCallback(() => {
    onFilters("type", type);
  }, [onFilters, type]);

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
          renderValue={(selected) => selected.map((value) => value).join(", ")}
          onClose={handleCloseCategory}
          sx={{ textTransform: "capitalize" }}
        >
          {categoryOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={category?.includes(option.value)}
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
        <InputLabel>Type</InputLabel>

        <Select
          multiple
          value={type}
          onChange={handleChangeType}
          input={<OutlinedInput label="Type" />}
          renderValue={(selected) => selected.map((value) => value).join(", ")}
          onClose={handleCloseType}
          sx={{ textTransform: "capitalize" }}
        >
          {typeOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={type?.includes(option.value)}
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
