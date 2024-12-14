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
import {
  AppointmentReport,
  AppointmentReportTableFilters,
  AppointmentReportPeriodFilters,
} from 'src/types/report';

import PeriodFilters from '../period-filters';
import AppointmentReportAnalytic from '../appointmentreport-analytic';
import AppointmentReportTableToolbar from '../appointmentreport-table-toolbar';
import DeatailedAppointmentTableFiltersResult from '../appointmentreport-table-filters-result';
import {
  RenderCellEndAt,
  RenderCellStartAt,
  RenderCellCustomer,
  RenderCellBookingSource,
} from '../appointmentreport-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'Invoiced', label: 'Invoiced' },
  { value: 'Pending', label: 'Pending Invoice' },
];

const BOOKINGSOUCE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Google Business', label: 'Google Business' },
  { value: 'FaceBook', label: 'FaceBook' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Website', label: 'Website' },
  { value: 'Mobile Apps', label: 'Mobile Apps' },
  { value: 'Whatsapp', label: 'Whatsapp' },
  { value: 'Unknown', label: 'Unknown' },
];

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function AppointmentReportListView() {
  const confirmRows = useBoolean();

  const theme = useTheme();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<AppointmentReport[]>([]);

  const periodfilters = useSetState<AppointmentReportPeriodFilters>({
    startDate: null,
    endDate: null,
  });

  const itemfilters = useSetState<AppointmentReportTableFilters>({
    branch: [],
    status: [],
    sourcetype: [],
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

  const canReset = itemfilters.state.branch.length > 0 || itemfilters.state.sourcetype.length > 0;

  const handleSearch = async () => {
    setisLoading(true);

    // prepare query based on filter data
    const data = {
      start: periodfilters.state.startDate,
      end: periodfilters.state.endDate,
      filtername: 'all',
      filterid: 1,
    };

    if (!periodfilters.state.startDate || !periodfilters.state.endDate) {
      toast.error('Missing Filter');
      setisLoading(false);
      return;
    }

    const response = await fetch('/api/salonapp/report/appointmentreport', {
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
      field: 'customerinfo',
      headerName: 'Customer',
      width: 180,
      filterable: true,
      hideable: false,
      valueGetter: (params: GridValueOptionsParams) => `${params.row.customerinfo.name}`,
      renderCell: (params) => <RenderCellCustomer params={params} />,
    },
    {
      field: 'telephone',
      headerName: 'Telephone',
      width: 130,
    },
    {
      field: 'start',
      headerName: 'Start Date',
      width: 100,
      renderCell: (params) => <RenderCellStartAt params={params} />,
    },
    {
      field: 'end',
      headerName: 'End Date',
      width: 100,
      renderCell: (params) => <RenderCellEndAt params={params} />,
    },

    {
      field: 'employee',
      headerName: 'Employee',
      width: 180,
      filterable: true,
      hideable: false,
    },
    {
      field: 'product',
      headerName: 'Product',
      filterable: true,
      hideable: false,
      width: 180,
    },
    {
      field: 'invoiced',
      headerName: 'Is invoced',
      filterable: true,
      hideable: false,
    },

    {
      field: 'bookingsource',
      headerName: 'Booking Source',
      filterable: true,
      hideable: false,
      width: 120,
      valueGetter: (params: GridValueOptionsParams) => `${params.row.bookingsource}`,
      renderCell: (params) => <RenderCellBookingSource params={params} />,
    },

    {
      field: 'branch',
      headerName: 'branch',
      width: 180,
      filterable: true,
      hideable: false,
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
            { name: 'Appointment Report' },
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
  filters: UseSetStateReturn<AppointmentReportTableFilters>;
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

  useEffect(() => {
    fetch(`/api/salonapp/branches`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setbranchData(data.data));
  }, [setbranchData]);

  return (
    <>
      <GridToolbarContainer>
        <AppointmentReportTableToolbar
          filters={filters}
          options={{
            branchOptions: branchData.map((branch) => ({
              value: branch.name,
              label: branch.name,
            })),
            statusOptions: STATUS_OPTIONS,
            sourceOptions: BOOKINGSOUCE_OPTIONS,
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
        <DeatailedAppointmentTableFiltersResult
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
  inputData: AppointmentReport[];
  filters: AppointmentReportTableFilters;
}) {
  const { status, branch, sourcetype } = filters;

  if (branch?.length) {
    inputData = inputData.filter((appointment) => branch.includes(appointment?.branch));
  }

  if (status?.length) {
    inputData = inputData.filter((appointment) => status.includes(appointment?.invoiced));
  }

  if (sourcetype?.length) {
    inputData = inputData.filter((appointment) => status.includes(appointment?.bookingsource));
  }

  return inputData;
}
