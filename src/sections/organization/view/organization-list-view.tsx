'use client';

import useSWR, { mutate } from 'swr';
import { useState, useEffect, useCallback } from 'react';

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

import { useBoolean } from 'minimal-shared/hooks';
import { useSetState } from 'src/hooks/use-set-state';

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';

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

import { type OrganizationItem, type OrganizationTableFilters } from 'src/types/organization';

import OrganizationTableRow from '../organization-table-row';
import OrganizationTableToolbar from '../organization-table-toolbar';
import OrganizationTableFiltersResult from '../organization-table-filters-result';

const signOut = jwtSignOut;
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

// ----------------------------------------------------------------------

export default function OrganizationListView() {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'name', label: t('general.name'), width: 320 },
    { id: 'address', label: t('general.address'), width: 320 },
    { id: 'telephone', label: t('general.telephone'), width: 320 },
    { id: 'email', label: t('general.email'), width: 320 },
    { id: '', width: 188 },
  ];

  // Initialize
  const [tableData, setTableData] = useState<OrganizationItem[]>([]);

  const filters = useSetState<OrganizationTableFilters>({
    name: '',
    status: 'all',
  });

  const {
    data: organization,
    isLoading: isservicecategoryLoading,
    error: errorB,
  } = useSWR('/api/salonapp/organization', fetcher);

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  // Logout the user
  const handleLogout = async () => {
    try {
      await signOut();
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
      const response = await fetch(`/api/salonapp/organization/${id}`, {
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

      const deleteRow = tableData.filter((row: OrganizationItem) => row.org_id !== id);

      toast.success(t('general.delete_success'));

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, t]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row: OrganizationItem) => !table.selected.includes(row.org_id)
    );

    toast.success(t('general.delete_success'));

    setTableData(deleteRows);

    table.onUpdatePageDeleteRow(dataInPage.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData, t]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.organization.edit(id));
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
    if (organization) {
      setTableData(organization.data);
    }
  }, [organization]);

  if (errorB) {
    if (errorB?.response?.data?.status === 401) {
      mutate(
        (key) => true, // which cache keys are updated
        undefined, // update cache data to `undefined`
        { revalidate: false } // do not revalidate
      );
      handleLogout();
    }
    return <div>Error loading data1.</div>;
  }

  if (isservicecategoryLoading) return <div>Loading...</div>;

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: t('salonapp.dashboard'), href: paths.dashboard.root },
            {
              name: t('salonapp.organization.organizations'),
              href: paths.dashboard.organization.root,
            },
            { name: t('general.list') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.organization.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('salonapp.organization.new_organization')}
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
                          (serviceitem: OrganizationItem) => serviceitem.name === tab.value
                        ).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrganizationTableToolbar filters={filters} onResetPage={table.onResetPage} />

          {canReset && (
            <OrganizationTableFiltersResult
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
                  dataFiltered.map((row) => row.org_id)
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
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) => {
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.org_id)
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
                      <OrganizationTableRow
                        key={row.org_id}
                        row={row}
                        selected={table.selected.includes(row.org_id)}
                        onSelectRow={() => {
                          table.onSelectRow(row.org_id);
                        }}
                        onDeleteRow={() => {
                          handleDeleteRow(row.org_id);
                        }}
                        onEditRow={() => {
                          handleEditRow(row.org_id);
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
  inputData: OrganizationItem[];
  comparator: (a: any, b: any) => number;
  filters: OrganizationTableFilters;
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
    inputData = inputData.filter((service) =>
      service.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return inputData;
}
