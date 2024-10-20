import { useCallback, useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { formHelperTextClasses } from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import Iconify from "src/components/iconify";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  SalesReportTableFilters,
  SalesReportTableFilterValue,
} from "src/types/report";
import { useForm, Controller } from "react-hook-form";
import { CSVLink } from "react-csv";
import { LiveCustomerSearch } from "src/components/livecustomersearch";
import { EmployeeItem } from "src/types/employee";
import { BranchItem } from "src/types/branch";
// ----------------------------------------------------------------------

type Props = {
  filters: SalesReportTableFilters;
  onFilters: (name: string, value: SalesReportTableFilterValue) => void;
  handleSearch: () => void;
  //
  dateError: boolean;
  serviceOptions: string[];
  getcsvData: () => string[][];
  employees: EmployeeItem[];
  branches: BranchItem[];
  isLoading: boolean;
};

export default function SalesReportTableToolbar({
  filters,
  onFilters,
  handleSearch,
  //
  dateError,
  serviceOptions,
  getcsvData,
  employees,
  branches,
  isLoading,
}: Props) {
  const popover = usePopover();

  const methods = useForm({});
  const {
    formState: { isSubmitting },
  } = methods;

  const csvLinkRef = useRef(null);

  const [csvData, setcsVData] = useState<string[][]>([]);

  const [isOpenEmployee, setIsOpenEmployee] = useState(false);
  const [isOpenCustomer, setIsOpenCustomer] = useState(false);
  const [isOpenBranch, setIsOpenBranch] = useState(false);

  const handleFilterName = useCallback(
    (event: SelectChangeEvent<string>) => {
      onFilters("filtername", event.target.value);
      if (event.target.value === "All Sales") {
        setIsOpenEmployee(false);
        setIsOpenCustomer(false);
        setIsOpenBranch(false);
      } else if (event.target.value === "Sales By Branch") {
        setIsOpenBranch(true);
        setIsOpenEmployee(false);
        setIsOpenCustomer(false);
      } else if (event.target.value === "Sales By Employee") {
        setIsOpenEmployee(true);
        setIsOpenCustomer(false);
        setIsOpenBranch(false);
      } else if (event.target.value === "Sales By Customer") {
        setIsOpenCustomer(true);
        setIsOpenEmployee(false);
        setIsOpenBranch(false);
      }
    },
    [onFilters]
  );

  // Handle all except the customer
  const handleFilterValue = useCallback(
    (event: SelectChangeEvent<string>) => {
      // const filtervalue = employees.find((employee) => employee.name == event.target.name)
      onFilters("filtervalue", event.target.value);
    },
    [onFilters]
  );

  // handle customer
  const handleSelectCustomer = useCallback(
    (value: string | undefined) => {
      onFilters("filtervalue", typeof value === undefined ? "" : value);
      console.log(value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters("startDate", newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters("endDate", newValue);
    },
    [onFilters]
  );

  const handleExportCSV = () => {
    // Retrieve the data using the callback function
    const csvdata = getcsvData();
    setcsVData(csvdata);
    // csvLinkRef?.current?.link?.click();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex", // Use flex to position the two stacks
          justifyContent: "space-between", // Space between left and right stacks
          alignItems: "center", // Vertically center items
        }}
      >
        <Stack
          spacing={2}
          alignItems={{ xs: "flex-end", md: "center" }}
          direction={{
            xs: "column",
            md: "row",
          }}
          sx={{
            p: 2.5,
            pr: { xs: 2.5, md: 1 },
          }}
        >
          <DatePicker
            label="Start date"
            value={filters.startDate}
            onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{
              maxWidth: { md: 180 },
            }}
          />

          <DatePicker
            label="End date"
            value={filters.endDate}
            onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                fullWidth: true,
                error: dateError,
                helperText:
                  dateError && "End date must be later than start date",
              },
            }}
            sx={{
              maxWidth: { md: 180 },
              [`& .${formHelperTextClasses.root}`]: {
                position: { md: "absolute" },
                bottom: { md: -40 },
              },
            }}
          />
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, md: 180 },
            }}
          >
            <InputLabel>Filter</InputLabel>
            <Select
              value={filters.filtername}
              onChange={handleFilterName}
              input={<OutlinedInput label="Filter" />}
              renderValue={(selected) => selected}
              sx={{ textTransform: "capitalize" }}
            >
              {serviceOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {isOpenEmployee && (
            <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 180 },
              }}
            >
              <InputLabel>Employee</InputLabel>

              <Select
                value={filters.filtervalue}
                onChange={handleFilterValue}
                input={<OutlinedInput label="Filter" />}
                renderValue={(selected) => selected}
                sx={{ textTransform: "capitalize" }}
              >
                {employees.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {isOpenBranch && (
            <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 180 },
              }}
            >
              <InputLabel>Branch</InputLabel>
              <Select
                value={filters.filtervalue}
                onChange={handleFilterValue}
                input={<OutlinedInput label="Filter" />}
                renderValue={(selected) => selected}
                sx={{ textTransform: "capitalize" }}
              >
                {branches.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {isOpenCustomer && (
            <FormControl
              sx={{
                flexShrink: 0,
                width: { xs: 1, md: 280 },
              }}
            >
              <LiveCustomerSearch
                handleSelectedCustomer={handleSelectCustomer}
              />
            </FormControl>
          )}

          <LoadingButton
            type="submit"
            size="large"
            variant="contained"
            onClick={() => {
              handleSearch();
            }}
            startIcon={<Iconify icon="material-symbols:search" />}
            loading={isLoading}
          >
            Search
          </LoadingButton>
        </Stack>

        <IconButton size="large" color="info" onClick={() => handleExportCSV()}>
          <Iconify icon="iwwa:file-csv" />
        </IconButton>

        <CSVLink
          data={csvData} // Call the function to fetch data
          filename="salesdata.csv"
          ref={csvLinkRef}
          style={{ display: "none" }}
        />
      </Box>
    </>
  );
}
