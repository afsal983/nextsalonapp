"use client";

import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Card,
  Stack,
  Badge,
  Button,
  Divider,
  useTheme,
  Container,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarExport,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { paths } from "src/routes/paths";

import { useBoolean } from "src/hooks/use-boolean";

import { isAfter } from "src/utils/format-time";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSnackbar } from "src/components/snackbar";
import EmptyContent from "src/components/empty-content";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import { BranchItem } from "src/types/branch";
import { PaymentTypeItem } from "src/types/payment";
import {
  AppointmentReport,
  AppointmentReportTableFilters,
  AppointmentReportPeriodFilters,
  AppointmentReportTableFilterValue,
} from "src/types/report";

import PeriodFilters from "../period-filters";
import AppointmentReportAnalytic from "../appointmentreport-analytic";
import DeatailedAppointmentTableToolbar from "../appointmentreport-table-toolbar";
import DeatailedAppointmentTableFiltersResult from "../appointmentreport-table-filters-result";
import {
  RenderCellEndAt,
  RenderCellStartAt,
  RenderCellCustomer,
  RenderCellBookingSource,
} from "../appointmentreport-table-row";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: "Invoiced", label: "Invoiced" },
  { value: "Pending", label: "Pending Invoice" },
];

const BOOKINGSOUCE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Google Business", label: "Google Business" },
  { value: "FaceBook", label: "FaceBook" },
  { value: "Instagram", label: "Instagram" },
  { value: "Website", label: "Website" },
  { value: "Mobile Apps", label: "Mobile Apps" },
  { value: "Whatsapp", label: "Whatsapp" },
  { value: "Unknown", label: "Unknown" },
];

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ["category", "actions"];

// This is for date filter to conditionaly fetch data from remote API
const defaultperiodFilters: AppointmentReportPeriodFilters = {
  startDate: null,
  endDate: null,
};

// This for filtering tables
const defaultitemFilters: AppointmentReportTableFilters = {
  branch: [],
  status: [],
  sourcetype: [],
};

// ----------------------------------------------------------------------

export default function AppointmentReportListView() {
  const { enqueueSnackbar } = useSnackbar();

  const confirmRows = useBoolean();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<AppointmentReport[]>([]);
  const [branchData, setbranchData] = useState<BranchItem[]>([]);

  const [periodfilters, setFilters] = useState(defaultperiodFilters);
  const [itemfilters, setitemFilters] = useState(defaultitemFilters);

  const dateError = isAfter(periodfilters.startDate, periodfilters.endDate);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>(
    []
  );

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    fetch(`/api/salonapp/branches`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setbranchData(data.data));

    fetch(`/api/salonapp/paymenttype`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setpaymenttypeData(data.data));
  }, [setbranchData, setpaymenttypeData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: itemfilters,
  });

  const canReset = !isEqual(defaultitemFilters, itemfilters);

  const handleitemFilters = useCallback(
    (name: string, value: AppointmentReportTableFilterValue) => {
      setitemFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handlePeriodFilters = useCallback(
    (name: string, value: AppointmentReportTableFilterValue) => {
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

  const handleSearch = async () => {
    setisLoading(true);

    // prepare query based on filter data
    const data = {
      start: periodfilters.startDate,
      end: periodfilters.endDate,
      filtername: "all",
      filterid: 1,
    };

    if (!periodfilters.startDate || !periodfilters.endDate) {
      enqueueSnackbar("Missing Filter", { variant: "error" });
      setisLoading(false);
      return;
    }

    const response = await fetch("/api/salonapp/report/appointmentreport", {
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Sn",
      filterable: true,
      width: 40,
      hideable: false,
    },
    {
      field: "customerinfo",
      headerName: "Customer",
      width: 180,
      filterable: true,
      hideable: false,
      valueGetter: (params) => `${params.row.customerinfo.name}`,
      renderCell: (params) => <RenderCellCustomer params={params} />,
    },
    {
      field: "telephone",
      headerName: "Telephone",
      width: 130,
    },
    {
      field: "start",
      headerName: "Start Date",
      width: 100,
      renderCell: (params) => <RenderCellStartAt params={params} />,
    },
    {
      field: "end",
      headerName: "End Date",
      width: 100,
      renderCell: (params) => <RenderCellEndAt params={params} />,
    },

    {
      field: "employee",
      headerName: "Employee",
      width: 180,
      filterable: true,
      hideable: false,
    },
    {
      field: "product",
      headerName: "Product",
      filterable: true,
      hideable: false,
      width: 180,
    },
    {
      field: "invoiced",
      headerName: "Is invoced",
      filterable: true,
      hideable: false,
    },

    {
      field: "bookingsource",
      headerName: "Booking Source",
      filterable: true,
      hideable: false,
      width: 120,
      valueGetter: (params) => `${params.row.bookingsource}`,
      renderCell: (params) => <RenderCellBookingSource params={params} />,
    },

    {
      field: "branch",
      headerName: "branch",
      width: 180,
      filterable: true,
      hideable: false,
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
              name: "Reports",
              href: paths.dashboard.report.root,
            },
            { name: "Appointment Report" },
          ]}
          action={
            <IconButton onClick={() => openFilters.onTrue()} size="large">
              <Badge variant="dot" color="primary">
                <FilterListIcon />
              </Badge>
            </IconButton>
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
              <AppointmentReportAnalytic
                title="Total"
                total={summaryData.totalAppoinment}
                percent={100}
                price={summaryData.totalCash}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <AppointmentReportAnalytic
                title="Invoiced"
                total={summaryData.serviceSaleCount}
                percent={summaryData.invoiceAppointmentCountpercent}
                price={summaryData.serviceSale}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <AppointmentReportAnalytic
                title="Pending"
                total={summaryData.uninvoiceAppointmentCount}
                percent={summaryData.uninvoiceAppointmentCountpercent}
                price={summaryData.retailSale}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
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
                    <DeatailedAppointmentTableToolbar
                      filters={itemfilters}
                      onFilters={handleitemFilters}
                      branchOptions={branchData.map((branch) => ({
                        value: branch.name,
                        label: branch.name,
                      }))}
                      statusOptions={STATUS_OPTIONS}
                      sourceOptions={BOOKINGSOUCE_OPTIONS}
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
                    <DeatailedAppointmentTableFiltersResult
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
        filters={periodfilters}
        onFilters={handlePeriodFilters}
        //
        canReset={canReset}
        onResetFilters={handleResetFilters}
        //
        dateError={dateError}
        //
        // events={[]}
        colorOptions={[]}
        // onClickEvent={onClickEventInFilters}
        isLoading={isLoading}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
}: {
  inputData: AppointmentReport[];
  filters: AppointmentReportTableFilters;
}) {
  const { status, branch, sourcetype } = filters;

  if (branch?.length) {
    inputData = inputData.filter((appointment) =>
      branch.includes(appointment?.branch)
    );
  }

  if (status?.length) {
    inputData = inputData.filter((appointment) =>
      status.includes(appointment?.invoiced)
    );
  }

  if (sourcetype?.length) {
    inputData = inputData.filter((appointment) =>
      status.includes(appointment?.bookingsource)
    );
  }

  return inputData;
}
