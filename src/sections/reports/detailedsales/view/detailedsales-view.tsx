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

import { BranchItem } from 'src/types/branch';
import { PaymentTypeItem } from 'src/types/payment';
import {
  DetailedInvoice,
  DetailedSalesReportTableFilters,
  DetailedSalesReportPeriodFilters,
  DetailedSalesReportTableFilterValue,
} from 'src/types/report';

import PeriodFilters from '../period-filters';
import DetailedSalesAnalytic from '../detailedsales-analytic';
import DeatailedSalesTableToolbar from '../detailedsales-table-toolbar';
import DeatailedSalesTableFiltersResult from '../detailedsales-table-filters-result';
import {
  RenderCellPrice,
  RenderCellProduct,
  RenderCellDiscount,
  RenderCellCreatedAt,
  RenderCellUnitPrice,
} from '../detailedsales-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'draft', label: 'Draft' },
];

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// This is for date filter to conditionaly fetch data from remote API
const defaultperiodFilters: DetailedSalesReportPeriodFilters = {
  startDate: null,
  endDate: null,
};

// This for filtering tables
const defaultitemFilters: DetailedSalesReportTableFilters = {
  branch: [],
  status: [],
  paymenttype: [],
};

// ----------------------------------------------------------------------

export default function DetailedSalesListView() {
  const confirmRows = useBoolean();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<DetailedInvoice[]>([]);
  const [branchData, setbranchData] = useState<BranchItem[]>([]);
  const [paymenttypeData, setpaymenttypeData] = useState<PaymentTypeItem[]>([]);

  const [periodfilters, setFilters] = useState(defaultperiodFilters);
  const [itemfilters, setitemFilters] = useState(defaultitemFilters);

  const dateError = fIsAfter(periodfilters.startDate, periodfilters.endDate);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

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
    (name: string, value: DetailedSalesReportTableFilterValue) => {
      setitemFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handlePeriodFilters = useCallback(
    (name: string, value: DetailedSalesReportTableFilterValue) => {
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

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleSearch = async () => {
    setisLoading(true);

    // prepare query based on filter data
    const data = {
      start: periodfilters.startDate,
      end: periodfilters.endDate,
      filtername: 'detailedsales',
      filterid: 1,
    };

    if (!periodfilters.startDate || !periodfilters.endDate) {
      toast.error('Missing Filter');
      setisLoading(false);
      return;
    }

    const response = await fetch('/api/salonapp/report/detailedsales', {
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
      field: 'invoicenumber',
      headerName: 'Bill No',
      filterable: true,
      hideable: false,
    },
    {
      field: 'createdat',
      headerName: 'Date',
      width: 100,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 100,
      editable: true,
      hideable: false,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'discount',
      headerName: 'Discount',
      width: 100,
      editable: true,
      renderCell: (params) => <RenderCellDiscount params={params} />,
    },
    {
      field: 'billingname',
      headerName: 'Billing Name',
      width: 180,
      filterable: true,
      hideable: false,
    },
    {
      field: 'employee',
      headerName: 'Employee',
      width: 180,
      filterable: true,
    },
    {
      field: 'tip',
      headerName: 'Tip',
      filterable: false,
    },
    {
      field: 'paymentmode',
      width: 100,
      headerName: 'Payment Mode',
      filterable: true,
    },
    {
      field: 'CASH',
      headerName: 'Cash',
      filterable: false,
    },
    {
      field: 'CARD',
      headerName: 'Card',
      filterable: false,
    },
    {
      field: 'authcode',
      headerName: 'Auth Code',
      filterable: false,
    },

    {
      field: 'item',
      headerName: 'Product',
      flex: 1,
      minWidth: 260,
      hideable: false,
      valueGetter: (params) => `${params.row.item.name}`,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'itemquantity',
      headerName: 'Quantity',
      filterable: false,
    },

    {
      field: 'unitprice',
      headerName: 'unit Price',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellUnitPrice params={params} />,
    },
    {
      field: 'branch',
      width: 240,
      headerName: 'Branch',
      filterable: false,
    },
    {
      field: 'invstatus',
      headerName: 'Status',
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
            { name: 'Detailed Sales Report' },
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
              <DetailedSalesAnalytic
                title="Total"
                total={summaryData.totalSaleCount}
                percent={100}
                price={summaryData.totalCash}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
              />

              <DetailedSalesAnalytic
                title="Service Sale"
                total={summaryData.serviceSaleCount}
                percent={10}
                price={summaryData.serviceSale}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
              />

              <DetailedSalesAnalytic
                title="Retail Sale"
                total={summaryData.retailSaleCount}
                percent={10}
                price={summaryData.retailSale}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
              />

              <DetailedSalesAnalytic
                title="Package Sale"
                total={summaryData.packageSaleCount}
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
  inputData: DetailedInvoice[];
  filters: DetailedSalesReportTableFilters;
}) {
  const { status, branch, paymenttype } = filters;

  if (branch?.length) {
    inputData = inputData.filter((invoice) => branch.includes(invoice?.branch));
  }

  if (status?.length) {
    inputData = inputData.filter((invoice) => status.includes(invoice?.invstatus));
  }

  if (paymenttype?.length) {
    inputData = inputData.filter((invoice) => status.includes(invoice?.paymentmode));
  }

  return inputData;
}
