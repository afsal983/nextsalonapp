"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Scrollbar from "src/components/scrollbar";
import { Divider } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useSnackbar } from "src/components/snackbar";
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import { BranchItem } from "src/types/branch";
import { EmployeeItem } from "src/types/employee";
import { DetailedInvoice } from "src/types/report";

import PeriodFilters from "../period-filters";

import DeatailedSalesTableToolbar from "../detailedsales-table-toolbar";
import DeatailedSalesTableFiltersResult from "../detailedsales-table-filters-result";
import DetailedSalesAnalytic from "../detailedsales-analytic";
import {
  DetailedSalesReportTableFilters,
  DetailedSalesReportTableFilterValue,
} from "src/types/report";

import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellPublish,
  RenderCellProduct,
  RenderCellCreatedAt,
  RenderBillingName,
  RenderCellDiscount,
  RenderCellUnitPrice,
} from "../detailedsales-table-row";

import { isAfter } from "src/utils/format-time";
import { ISalesTableFilters } from "src/types/report";
import { PaymentTypeItem } from "src/types/payment";

const FILTER_OPTIONS = [
  { id: "detailedsales", name: "Detailed Sales", value: "detailedsales" },
  { id: "all", name: "All Sales", value: "all" },
  { id: "branch", name: "Sales By Branch", value: "branch" },
  { id: "customer", name: "Sales By Customer", value: "customer" },
  { id: "employee", name: "Sales By Employee", value: "employee" },
];

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "draft", label: "Draft" },
];

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ["category", "actions"];

// This is for date filter
const defaultperiodFilters: DetailedSalesReportTableFilters = {
  startDate: null,
  endDate: null,
};

// This for filtering items
const defaultitemFilters: ISalesTableFilters = {
  branch: [],
  status: [],
  paymenttype: [],
};

// ----------------------------------------------------------------------

export default function DetailedSalesListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const theme = useTheme();

  const router = useRouter();

  const settings = useSettingsContext();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<DetailedInvoice[]>([]);
  const [employeeData, setemployeeData] = useState<EmployeeItem[]>([]);
  const [branchData, setbranchData] = useState<BranchItem[]>([]);
  const [paymenttypeData, setpaymenttypeData] = useState<PaymentTypeItem[]>([]);

  const [filters, setFilters] = useState(defaultperiodFilters);
  const [itemfilters, setitemFilters] = useState(defaultitemFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
    []
  );

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    fetch(`/api/salonapp/employee?branch_id=1`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setemployeeData(data.data));

    fetch(`/api/salonapp/branches`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setbranchData(data.data));

    fetch(`/api/salonapp/paymenttype`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setpaymenttypeData(data.data));
  }, [setbranchData, setemployeeData, setpaymenttypeData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: itemfilters,
  });

  const canReset = !isEqual(defaultperiodFilters, PeriodFilters);
  console.log(canReset);

  const handleitemFilters = useCallback(
    (name: string, value: DetailedSalesReportTableFilterValue) => {
      console.log(name);
      setitemFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handlePeriodFilters = useCallback(
    (name: string, value: DetailedSalesReportTableFilterValue) => {
      console.log(name);
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setitemFilters(defaultitemFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar("Delete success!");

      setTableData(deleteRow);
    },
    [enqueueSnackbar, tableData]
  );

  const handleSearch = async () => {
    let filterid;
    setisLoading(true);

    // prepare query based on filter data
    const data = {
      start: filters.startDate,
      end: filters.endDate,
      filtername: "detailedsales",
      filterid: 1,
    };

    if (!filters.startDate || !filters.endDate) {
      enqueueSnackbar("Missing Filter", { variant: "error" });
      setisLoading(false);
      return;
    }

    const response = await fetch("/api/salonapp/report/detailedsales", {
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
    console.log(responseData.data);
    setTableData(responseData.data);
    setsummaryData(responseData.summary);

    setisLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: "invoicenumber",
      headerName: "Bill No",
      filterable: false,
    },
    {
      field: "date",
      headerName: "Date",
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: "total",
      headerName: "Total",
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: "Discount",
      headerName: "discount",
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellDiscount params={params} />,
    },
    {
      field: "billingname",
      headerName: "Billing Name",
      width: 180,
      filterable: false,
    },
    {
      field: "employee",
      headerName: "Employee",
      width: 180,
      filterable: false,
    },
    {
      field: "tip",
      headerName: "Tip",
      filterable: false,
    },
    {
      field: "paymentmode",
      headerName: "Payment Mode",
      filterable: false,
    },
    {
      field: "CASH",
      headerName: "Cash",
      filterable: false,
    },
    {
      field: "CARD",
      headerName: "Card",
      filterable: false,
    },
    {
      field: "authcode",
      headerName: "Auth Code",
      filterable: false,
    },

    {
      field: "item",
      headerName: "Product",
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: "itemquantity",
      headerName: "Quantity",
      filterable: false,
    },

    {
      field: "unitprice",
      headerName: "unit Price",
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellUnitPrice params={params} />,
    },
    {
      field: "branch",
      headerName: "Branch",
      filterable: false,
    },
    {
      field: "invstatus",
      headerName: "Status",
      filterable: false,
    },

    /*
    {
      field: "name",
      headerName: "Product",
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: "date",
      headerName: "Date",
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },

    {
      field: "billingname",
      headerName: "billingname",
      width: 160,
      renderCell: (params) => <RenderBillingName params={params} />,
    },
    {
      field: "inventoryType",
      headerName: "Stock",
      width: 160,
      type: "singleSelect",
      valueOptions: PRODUCT_STOCK_OPTIONS,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: "total",
      headerName: "total",
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: "publish",
      headerName: "Publish",
      width: 110,
      type: "singleSelect",
      editable: true,
      valueOptions: branchData,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      type: "actions",
      field: "actions",
      headerName: " ",
      align: "right",
      headerAlign: "right",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: "error.main" }}
        />,
      ],
    },
    */
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : "lg"}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Product",
              href: paths.dashboard.product.root,
            },
            { name: "List" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="material-symbols:search" />}
              onClick={() => openFilters.onTrue()}
            >
              Search
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
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
              <DetailedSalesAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={summaryData.totalCash}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <DetailedSalesAnalytic
                title="Sservice Sale"
                total={summaryData.serviceSale}
                percent={10}
                price={summaryData.serviceSale}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <DetailedSalesAnalytic
                title="Retail Sale"
                total={summaryData.retailSale}
                percent={10}
                price={summaryData.retailSale}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <DetailedSalesAnalytic
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

        <Card
          sx={{
            height: { xs: 800, md: 2 },
            flexGrow: { md: 1 },
            display: { md: "flex" },
            flexDirection: { md: "column" },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={isLoading}
            getRowHeight={() => "auto"}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    <DeatailedSalesTableToolbar
                      filters={itemfilters}
                      onFilters={handleitemFilters}
                      branchOptions={branchData.map((branch) => ({
                        value: branch.name,
                        label: branch.name,
                      }))}
                      statusOptions={STATUS_OPTIONS}
                      paymentOptions={paymenttypeData.map((branch) => ({
                        value: branch.name,
                        label: branch.name,
                      }))}
                    />

                    <GridToolbarQuickFilter />

                    <Stack
                      spacing={1}
                      flexGrow={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {!!selectedRowIds.length && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          }
                          onClick={confirmRows.onTrue}
                        >
                          Delete ({selectedRowIds.length})
                        </Button>
                      )}

                      <GridToolbarColumnsButton />
                      <GridToolbarFilterButton />
                      <GridToolbarExport />
                    </Stack>
                  </GridToolbarContainer>

                  {canReset && (
                    <DeatailedSalesTableFiltersResult
                      filters={itemfilters}
                      onFilters={handleitemFilters}
                      onResetFilters={handleResetFilters}
                      results={dataFiltered.length}
                      sx={{ p: 2.5, pt: 0 }}
                    />
                  )}
                </>
              ),
              noRowsOverlay: () => <EmptyContent title="No Data" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
              },
            }}
          />
        </Card>
      </Container>

      <PeriodFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        handleSearch={handleSearch}
        //
        filters={filters}
        onFilters={handlePeriodFilters}
        //
        canReset={canReset}
        onResetFilters={handleResetFilters}
        //
        dateError={dateError}
        //
        events={[]}
        colorOptions={[]}
        // onClickEvent={onClickEventInFilters}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
}: {
  inputData: DetailedInvoice[];
  filters: ISalesTableFilters;
}) {
  const { status, branch, paymenttype } = filters;

  if (branch?.length) {
    inputData = inputData.filter((invoice) => branch.includes(invoice?.branch));
  }

  if (status?.length) {
    inputData = inputData.filter((invoice) =>
      status.includes(invoice?.invstatus)
    );
  }

  if (paymenttype?.length) {
    inputData = inputData.filter((invoice) =>
      status.includes(invoice?.paymentmode)
    );
  }

  return inputData;
}
