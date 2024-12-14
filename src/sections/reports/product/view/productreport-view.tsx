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

import { ServiceCategoryItem } from 'src/types/service';
import {
  ProductReport,
  ProductReportTableFilters,
  ProductReportPeriodFilters,
} from 'src/types/report';

import PeriodFilters from '../period-filters';
import ProductReportAnalytic from '../productreport-analytic';
import ProductReportTableToolbar from '../productreport-table-toolbar';
import ProductTableFiltersResult from '../productreport-table-filters-result';
import { RenderCellPrice, RenderCellProduct } from '../productreport-table-row';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
  { value: 'Service', label: 'Service' },
  { value: 'Retail', label: 'Retails' },
  { value: 'Package', label: 'Package' },
];

const HIDE_COLUMNS = {
  category1: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category1', 'actions'];

// ----------------------------------------------------------------------

export default function ProductReportListView() {
  const confirmRows = useBoolean();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [isLoading, setisLoading] = useState(false);

  const openFilters = useBoolean();

  const [summaryData, setsummaryData] = useState<any>([]);
  const [tableData, setTableData] = useState<ProductReport[]>([]);

  // This is for date filter to conditionaly fetch data from remote API
  const periodfilters = useSetState<ProductReportPeriodFilters>({
    startDate: null,
    endDate: null,
  });

  // This for filtering tables
  const itemfilters = useSetState<ProductReportTableFilters>({
    category: [],
    type: [],
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

  const canReset = itemfilters.state.category.length > 0 || itemfilters.state.type.length > 0;

  const handleSearch = async () => {
    setisLoading(true);

    // prepare query based on filter data
    const data = {
      start: periodfilters.state.startDate,
      end: periodfilters.state.endDate,
      filtername: 'all',
      filterid: 1,
    };

    const response = await fetch('/api/salonapp/report/productreport', {
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
      field: 'productinfo',
      headerName: 'Product Name',
      filterable: true,
      hideable: false,
      width: 280,
      renderCell: (params) => <RenderCellProduct params={params} />,
      valueGetter: (params: GridValueOptionsParams) => params.row.productinfo.name,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      editable: true,
      hideable: false,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },

    {
      field: 'category',
      headerName: 'Category',
      width: 180,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 180,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 180,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 180,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 100,
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
            { name: 'Product Report' },
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
              <ProductReportAnalytic
                title="Total"
                total={summaryData.totalProduct}
                percent={100}
                price={summaryData.totalCash}
                icon="arcticons:lifetotal"
                color={theme.palette.info.main}
              />

              <ProductReportAnalytic
                title="Service"
                total={summaryData.serviceCount}
                percent={summaryData.servicepercent}
                price={summaryData.serviceSale}
                icon="map:beauty-salon"
                color={theme.palette.success.main}
              />

              <ProductReportAnalytic
                title="Retail"
                total={summaryData.retailCount}
                percent={summaryData.retailpercent}
                price={summaryData.retailSale}
                icon="solar:cosmetic-bold"
                color={theme.palette.warning.main}
              />

              <ProductReportAnalytic
                title="Other"
                total={summaryData.packageCount}
                percent={summaryData.packagepercent}
                price={summaryData.packageSale}
                icon="oui:package"
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
  filters: UseSetStateReturn<ProductReportTableFilters>;
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
  const [categoryData, setcategoryData] = useState<ServiceCategoryItem[]>([]);

  useEffect(() => {
    fetch(`/api/salonapp/servicecategory`)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setcategoryData(data.data));
  }, [setcategoryData]);

  return (
    <>
      <GridToolbarContainer>
        <ProductReportTableToolbar
          filters={filters}
          options={{
            categoryOptions: categoryData.map((branch) => ({
              value: branch.name,
              label: branch.name,
            })),
            typeOptions: TYPE_OPTIONS,
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
        <ProductTableFiltersResult
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
  inputData: ProductReport[];
  filters: ProductReportTableFilters;
}) {
  const { type, category } = filters;

  if (category?.length) {
    inputData = inputData.filter((invoice) => category.includes(invoice?.category));
  }

  if (type?.length) {
    inputData = inputData.filter((invoice) => type.includes(invoice?.type));
  }

  return inputData;
}
