"use client";

import sumBy from "lodash/sumBy";
import { useState, useCallback, useEffect } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import { CSVLink, CSVDownload } from "react-csv";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { isAfter, isBetween } from "src/utils/format-time";

import { useTranslate } from "src/locales";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSnackbar } from "src/components/snackbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";

import {
  SalesReportTableFilters,
  SalesReportTableFilterValue,
} from "src/types/report";

import { EmployeeItem } from "src/types/employee";
import { BranchItem } from "src/types/branch";
import SalesReportTableRow from "./salesreport-table-row";
import SalesReportTableToolbar from "./salesreport-table-toolbar";
import SalesReportTableFiltersResult from "./salesreport-table-filters-result";
import SalesReportAnalytic from "../invoice-analytic";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "serial", label: "Serial" },
  { id: "invoicenumber", label: "SalesReport Number" },
  { id: "date", label: "Date" },
  { id: "invoicevalue", label: "SalesReport Value" },
  { id: "sgst", label: "CGST" },
  { id: "cgst", label: "SGST" },
  { id: "tax", label: "TAX" },
  { id: "name", label: "Name" },
  { id: "branchname", label: "Branch Name" },
  { id: "status", label: "Status" },
  { id: "" },
];

const FILTER_OPTIONS = [
  { id: "all", name: "All Sales", value: "all" },
  { id: "branch", name: "Sales By Branch", value: "branch" },
  { id: "customer", name: "Sales By Customer", value: "customer" },
  { id: "employee", name: "Sales By Employee", value: "employee" },
];

const defaultFilters: SalesReportTableFilters = {
  name: "",
  filtername: "",
  filtervalue: "1",
  status: "all",
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------
type Props = {
  reportid: string;
};

export default function SalesReportDetailsView({ reportid }: Props) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: "createDate" });

  const [isLoading, setisLoading] = useState(false);

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<any[]>([]);
  const [summaryData, setsummaryData] = useState<any>([]);
  const [employeeData, setemployeeData] = useState<EmployeeItem[]>([]);
  const [branchData, setbranchData] = useState<BranchItem[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = tableData;

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name ||
    !!filters.filtername ||
    filters.status !== "all" ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getSalesReportLength = (status: string) =>
    tableData.filter((item) => item?.status === status).length;

  const handleFilters = useCallback(
    (name: string, value: SalesReportTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSearch = async () => {
    let filterid;
    setisLoading(true);

    const filter = FILTER_OPTIONS.find(
      (item) => item.name === filters.filtername
    );
    if (filters.filtername === "Sales By Employee") {
      const filtervalue = employeeData.find(
        (employee) => employee.name === filters.filtervalue
      );
      filterid = filtervalue?.id;
    } else if (filters.filtername === "Sales By Branch") {
      const filtervalue = branchData.find(
        (branch) => branch.name === filters.filtervalue
      );
      filterid = filtervalue?.branch_id;
    } else {
      filterid = filters.filtervalue;
    }

    // prepare query based on filter data
    const data = {
      start: filters.startDate,
      end: filters.endDate,
      filtername: filter?.value,
      filterid: Number(filterid),
    };

    if (!filters.startDate || !filters.endDate || filters.filtername === "") {
      enqueueSnackbar("Missing Filter", { variant: "error" });
      setisLoading(false);
      return;
    }

    const response = await fetch("/api/salonapp/report/salesreport", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const responseData = await response.json();

    if (responseData.status > 300) {
      setisLoading(false);
      enqueueSnackbar("Fetching report data failed", { variant: "error" });
      return;
    }
    setTableData(responseData.data);
    setsummaryData(responseData.summary);

    setisLoading(false);
  };

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters("status", newValue);
    },
    [handleFilters]
  );

  const getcsvData = useCallback(() => {
    const headers = [
      "Serial No",
      "SalesReport Number",
      "Date",
      "SalesReport Value",
      "CGST",
      "SGST",
      "TAX",
      "Customer Name",
      "Branch Name",
      "SalesReport Status",
    ];
    const csvData = [
      headers,
      ...dataFiltered.map(
        ({
          serial,
          invoicenumber,
          date,
          invoicevalue,
          tax,
          taxby2,
          billingname,
          branchname,
          status,
        }) => [
          serial,
          invoicenumber,
          date,
          invoicevalue,
          taxby2,
          taxby2,
          tax,
          billingname,
          branchname,
          status,
        ]
      ),
    ];
    console.log(csvData);
    return csvData;
  }, [dataFiltered]);

  useEffect(() => {
    console.log("sss");
    fetch(`/api/salonapp/employee?branch_id=1`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setemployeeData(data.data));

    fetch(`/api/salonapp/branches`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setbranchData(data.data));
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: t("salonapp.dashboard"),
              href: paths.dashboard.root,
            },
            {
              name: t("salonapp.invoice.invoice"),
              href: paths.dashboard.invoice.root,
            },
            {
              name: t("general.report"),
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderStyle: "dashed" }}
                />
              }
              sx={{ py: 2 }}
            >
              <SalesReportAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={summaryData.totalCash}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <SalesReportAnalytic
                title="Sservice Sale"
                total={summaryData.serviceSale}
                percent={10}
                price={summaryData.serviceSale}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <SalesReportAnalytic
                title="Retail Sale"
                total={summaryData.retailSale}
                percent={10}
                price={summaryData.retailSale}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <SalesReportAnalytic
                title="Package Sale"
                total={summaryData.packageSale}
                percent={10}
                price={summaryData.packageSale}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <SalesReportTableToolbar
            filters={filters}
            onFilters={handleFilters}
            handleSearch={handleSearch}
            //
            dateError={dateError}
            serviceOptions={FILTER_OPTIONS.map((option) => option.name)}
            getcsvData={getcsvData}
            employees={employeeData}
            branches={branchData}
            isLoading={isLoading}
          />

          {canReset && (
            <SalesReportTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <SalesReportTableRow key={row.index} row={row} />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
