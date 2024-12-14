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
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CustomerCategory } from 'src/types/customer';
import {
  CustomerReport,
  CustomerReportTableFilters,
  CustomerReportPeriodFilters,
} from 'src/types/report';

import PeriodFilters from '../period-filters';
import CustomerReportAnalytic from '../customerreport-analytic';
import CustomerReportTableToolbar from '../customerreport-table-toolbar';
import CustomerReportTableFiltersResult from '../customerreport-table-filters-result';
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

// ----------------------------------------------------------------------

export default function CustomerReportListView() {
  const confirmRows = useBoolean();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<CustomerReport[]>([]);

  // This is for date filter to conditionaly fetch data from remote API
  const periodfilters = useSetState<CustomerReportPeriodFilters>({
    startDate: null,
    endDate: null,
  });

  // This for filtering tables
  const itemfilters = useSetState<CustomerReportTableFilters>({
    category: [],
    sex: [],
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

  const canReset = itemfilters.state.category.length > 0 || itemfilters.state.sex.length > 0;

  const handleSearch = async () => {
    setisLoading(true);

    // prepare query based on filter data
    const data = {
      start: periodfilters.state.startDate,
      end: periodfilters.state.endDate,
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
      headerName: 'Customer Name',
      filterable: true,
      hideable: false,
      width: 280,
      renderCell: (params) => <RenderCellCustomer params={params} />,
      valueGetter: (params: GridValueOptionsParams) => params.row.customerinfo.name,
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
  filters: UseSetStateReturn<CustomerReportTableFilters>;
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
  const [categoryData, setcategoryData] = useState<CustomerCategory[]>([]);

  useEffect(() => {
    fetch(`/api/salonapp/customercategory`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setcategoryData(data.data));
  }, [setcategoryData]);

  return (
    <>
      <GridToolbarContainer>
        <CustomerReportTableToolbar
          filters={filters}
          options={{
            categoryOptions: categoryData.map((category) => ({
              value: category.name,
              label: category.name,
            })),
            sexOptions: SEX_OPTIONS,
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
        <CustomerReportTableFiltersResult
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
