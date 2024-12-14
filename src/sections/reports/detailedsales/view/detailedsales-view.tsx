'use client';

import { useState, useEffect, useCallback } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import { Card, Stack, Badge, Button, Divider, useTheme, IconButton } from '@mui/material';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridValueOptionsParams,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'minimal-shared/hooks';
import { useSetState } from 'src/hooks/use-set-state';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BranchItem } from 'src/types/branch';
import { PaymentTypeItem } from 'src/types/payment';
import {
  DetailedInvoice,
  DetailedSalesReportTableFilters,
  DetailedSalesReportPeriodFilters,
} from 'src/types/report';

import PeriodFilters from '../period-filters';
import DetailedSalesAnalytic from '../detailedsales-analytic';
import DetailedSalesTableToolbar from '../detailedsales-table-toolbar';
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

// ----------------------------------------------------------------------

export default function DetailedSalesListView() {
  const confirmRows = useBoolean();

  const theme = useTheme();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<DetailedInvoice[]>([]);

  const periodfilters = useSetState<DetailedSalesReportPeriodFilters>({
    startDate: null,
    endDate: null,
  });

  const itemfilters = useSetState<DetailedSalesReportTableFilters>({
    branch: [],
    status: [],
    paymenttype: [],
  });

  const dateError = fIsAfter(periodfilters.state.startDate, periodfilters.state.endDate);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: itemfilters.state,
  });

  const canReset = itemfilters.state.branch.length > 0 || itemfilters.state.paymenttype.length > 0;

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
      start: periodfilters.state.startDate,
      end: periodfilters.state.endDate,
      filtername: 'detailedsales',
      filterid: 1,
    };

    if (!periodfilters.state.startDate || !periodfilters.state.endDate) {
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

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={itemfilters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemfilters.state, selectedRowIds]
  );

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
      valueGetter: (params: GridValueOptionsParams) => `${params.row?.item?.name}`,
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
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
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
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback as GridSlots['toolbar'],
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              // @ts-ignore
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>

      <PeriodFilters
        open={openFilters.value}
        onClose={openFilters.onFalse}
        handleSearch={handleSearch}
        filters={periodfilters}
        canReset={canReset}
        dateError={dateError}
        colorOptions={[]}
      />
    </>
  );
}
// ---------------------------------------------------------------------

interface CustomToolbarProps {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
  filters: UseSetStateReturn<DetailedSalesReportTableFilters>;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  const [branchData, setbranchData] = useState<BranchItem[]>([]);
  const [paymenttypeData, setpaymenttypeData] = useState<PaymentTypeItem[]>([]);

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

  return (
    <>
      <GridToolbarContainer>
        <DetailedSalesTableToolbar
          filters={filters}
          options={{
            branchOptions: branchData.map((branch) => ({
              value: branch.name,
              label: branch.name,
            })),
            statusOptions: STATUS_OPTIONS,
            paymentOptions: paymenttypeData.map((payment) => ({
              value: payment.name,
              label: payment.name,
            })),
          }}
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
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <DeatailedSalesTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
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
