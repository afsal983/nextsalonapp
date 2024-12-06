'use client';

import useSWR, { mutate } from 'swr';
import { isEqual } from 'src/utils/helper';
import { useState, useEffect, useCallback } from 'react';
import { useSetState } from 'src/hooks/use-set-state';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { DashboardContent } from 'src/layouts/dashboard';
import { useBoolean } from 'src/hooks/use-boolean';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import {
  type PaymentTypeItem,
  type PaymentTypeFilterValue,
  type PaymentTypeTableFilters,
} from 'src/types/paymenttype';

import RetailTableRow from '../paymenttype-table-row';
import PaymentTypeTableToolbar from '../paymenttype-table-toolbar';
import PaymentTypeTableFiltersResult from '../paymenttype-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

// ----------------------------------------------------------------------
export default function PaymentTypeListView() {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'name', label: t('general.name'), width: 120 },
    { id: 'desc', label: t('general.description'), width: 120 },
    {
      id: 'default_paymenttype',
      label: t('salonapp.paymenttype.default_paymenttype'),
      width: 30,
    },
    { id: 'authcode', label: t('salonapp.paymenttype.authcode'), width: 30 },
    { id: '', width: 18 },
  ];

  // Initialize
  const [tableData, setTableData] = useState<PaymentTypeItem[]>([]);

  const filters = useSetState<PaymentTypeTableFilters>({
    name: '',
    status: 'all',
  });

  const { logout } = useAuthContext();

  // Use SWR to fetch data from multiple endpoints in parallel
  const {
    data: retail,
    isLoading: isretailLoading,
    error: errorA,
  } = useSWR('/api/salonapp/paymenttype', fetcher);

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  // Logout the user
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !!filters.state.name || filters.state.status !== 'all';

  const notFound = (dataFiltered.length === 0 && canReset) || dataFiltered.length === 0;

  // Delete an item
  const handleDeleteRow = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/salonapp/paymenttype/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(t('general.delete_fail'));
        return;
      }

      const deleteRow = tableData.filter((row: PaymentTypeItem) => row.id !== id);

      toast.success(t('general.delete_success'));

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, t]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row: PaymentTypeItem) => !table.selected.includes(row.id));

    toast.success(t('general.delete_success'));

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData, t]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.invoice.paymenttypes.edit(Number(id)));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  // Use useEffect to update state1 when data1 is available
  useEffect(() => {
    if (retail) {
      setTableData(retail.data);
    }
  }, [retail]);

  if (errorA) {
    if (errorA?.response?.data?.status === 401) {
      mutate(
        (key) => true, // which cache keys are updated
        undefined, // update cache data to `undefined`
        { revalidate: false } // do not revalidate
      );
      handleLogout();
    }
    return <div>Error loading data1.</div>;
  }

  // Display loading page
  if (isretailLoading) return <div>Loading...</div>;
  if (errorA) return <div>Error Loading...</div>;

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: t('salonapp.dashboard'), href: paths.dashboard.root },
            {
              name: t('salonapp.paymenttype.paymenttype'),
              href: paths.dashboard.retails.root,
            },
            { name: t('general.list') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.invoice.paymenttypes.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('salonapp.paymenttype.new_paymenttype')}
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color="default"
                  >
                    {['active'].includes(tab.value)
                      ? tableData.filter(
                          (retailitem: PaymentTypeItem) => retailitem.name === tab.value
                        ).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <PaymentTypeTableToolbar filters={filters} onResetPage={table.onResetPage} />
          {canReset && (
            <PaymentTypeTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                );
              }}
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) => {
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    );
                  }}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <RetailTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => {
                          table.onSelectRow(row.id);
                        }}
                        onDeleteRow={() => {
                          handleDeleteRow(row.id);
                        }}
                        onEditRow={() => {
                          handleEditRow(row.id);
                        }}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
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
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: PaymentTypeItem[];
  comparator: (a: any, b: any) => number;
  filters: PaymentTypeTableFilters;
}) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((retail) =>
      retail.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return inputData;
}
