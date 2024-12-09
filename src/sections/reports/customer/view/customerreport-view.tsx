'use client';

import { isEqual } from 'src/utils/helper';
import { useState, useEffect, useCallback } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Card,
  Stack,
  Badge,
  Button,
  Divider,
  useTheme,
  Container,
  IconButton,
} from '@mui/material';
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
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { fIsAfter } from 'src/utils/format-time';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CustomerCategory } from 'src/types/customer';
import {
  CustomerReport,
  CustomerReportTableFilters,
  CustomerReportPeriodFilters,
  CustomerReportTableFilterValue,
} from 'src/types/report';

import PeriodFilters from '../period-filters';
import CustomerReportAnalytic from '../customerreport-analytic';
import DeatailedSalesTableToolbar from '../customerreport-table-toolbar';
import DeatailedSalesTableFiltersResult from '../customerreport-table-filters-result';
import {
  RenderCellSex,
  RenderCellCustomer,
  RenderCellEventNotify,
  RenderCellPromoNotify,
} from '../customerreport-table-row';

// ----------------------------------------------------------------------

const SEX_OPTIONS = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Other', label: 'Other' },
];

const HIDE_COLUMNS = {
  category1: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category1', 'actions'];

// This is for date filter to conditionaly fetch data from remote API
const defaultperiodFilters: CustomerReportPeriodFilters = {
  startDate: null,
  endDate: null,
};

// This for filtering tables
const defaultitemFilters: CustomerReportTableFilters = {
  category: [],
  sex: [],
};

// ----------------------------------------------------------------------

export default function CustomerReportListView() {
  const confirmRows = useBoolean();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<CustomerReport[]>([]);
  const [categoryData, setcategoryData] = useState<CustomerCategory[]>([]);

  const [periodfilters, setFilters] = useState(defaultperiodFilters);
  const [itemfilters, setitemFilters] = useState(defaultitemFilters);

  const dateError = fIsAfter(periodfilters.startDate, periodfilters.endDate);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    fetch(`/api/salonapp/customercategory`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setcategoryData(data.data));
  }, [setcategoryData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: itemfilters,
  });

  const canReset = !isEqual(defaultitemFilters, itemfilters);

  const handleitemFilters = useCallback((name: string, value: CustomerReportTableFilterValue) => {
    setitemFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handlePeriodFilters = useCallback((name: string, value: CustomerReportTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setitemFilters(defaultitemFilters);
  }, []);

  const handleSearch = async () => {
    setisLoading(true);

    // prepare query based on filter data
    const data = {
      start: periodfilters.startDate,
      end: periodfilters.endDate,
      filtername: 'all',
      filterid: 1,
    };

    const response = await fetch('/api/salonapp/report/customerreport', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const responseData = await response.json();

    if (responseData.status > 300) {
      setisLoading(false);
      toast.error('Fetching report data failed');

      return;
    }
    setTableData(responseData.data);

    setsummaryData(responseData.summary);
    setisLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Sn',
      filterable: true,
      width: 40,
      hideable: false,
    },
    {
      field: 'customerinfo',
      headerName: 'Customer Name',
      filterable: true,
      hideable: false,
      width: 280,
      renderCell: (params) => <RenderCellCustomer params={params} />,
      valueGetter: (params) => params.row.customerinfo.name,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 180,
    },
    {
      field: 'sex',
      headerName: 'sex',
      width: 100,
      renderCell: (params) => <RenderCellSex params={params} />,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 180,
    },
    {
      field: 'dob',
      headerName: 'dob',
      width: 100,
    },
    {
      field: 'taxid',
      headerName: 'TID',
      width: 100,
    },
    {
      field: 'cardno',
      headerName: 'Loyalty card',
      width: 100,
    },
    {
      field: 'cardno',
      headerName: 'Loyalty card',
      width: 100,
    },
    {
      field: 'eventnotify',
      headerName: 'Event Notification',
      width: 100,
      renderCell: (params) => <RenderCellEventNotify params={params} />,
    },
    {
      field: 'promonotify',
      headerName: 'Promotion Notification',
      width: 100,
      renderCell: (params) => <RenderCellPromoNotify params={params} />,
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
      valueOptions: categoryData,
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
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'Reports',
              href: paths.dashboard.report.root,
            },
            { name: 'Customer Report' },
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
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <CustomerReportAnalytic
                title="Total"
                total={summaryData.totalCustomers}
                percent={100}
                price={summaryData.totalCash}
                icon="mdi:human-male-male-child"
                color={theme.palette.info.main}
              />

              <CustomerReportAnalytic
                title="Female"
                total={summaryData.female}
                percent={summaryData.femalepercent}
                price={summaryData.serviceSale}
                icon="fa:female"
                color={theme.palette.success.main}
              />

              <CustomerReportAnalytic
                title="Male"
                total={summaryData.male}
                percent={summaryData.malepercent}
                price={summaryData.retailSale}
                icon="fa:male"
                color={theme.palette.warning.main}
              />

              <CustomerReportAnalytic
                title="Other"
                total={summaryData.other}
                percent={summaryData.otherpercent}
                price={summaryData.packageSale}
                icon="ic:baseline-transgender"
                color={theme.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card
          sx={{
            height: { xs: 800, md: 2 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={isLoading}
            getRowHeight={() => 'auto'}
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
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    <DeatailedSalesTableToolbar
                      filters={itemfilters}
                      onFilters={handleitemFilters}
                      categoryOptions={categoryData.map((category) => ({
                        value: category.name,
                        label: category.name,
                      }))}
                      sexOptions={SEX_OPTIONS}
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
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
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
  inputData: CustomerReport[];
  filters: CustomerReportTableFilters;
}) {
  const { sex, category } = filters;

  if (category?.length) {
    inputData = inputData.filter((customer) => category.includes(customer?.category));
  }

  if (sex?.length) {
    inputData = inputData.filter((customer) => sex.includes(customer?.sex));
  }

  return inputData;
}
