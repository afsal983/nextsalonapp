'use client';

import dayjs from 'dayjs';
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

import { fIsAfter } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

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

import { AppointmentItem, AppointmentTableFilters } from 'src/types/appointment';

import AppointmentTableRow from '../appointment-table-row';
import AppointmentTableToolbar from '../appointment-table-toolbar';
import { AppointmentTableFiltersResult } from '../appointment-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Invoiced', label: 'Invoiced' },
  { value: 'Pendinginvoice', label: 'Pendinginvoice' },
];

const TABLE_HEAD = [
  { id: 'AppointmentNumber', label: 'ID', width: 116 },
  { id: 'customer', label: 'Customer' },
  { id: 'start', label: 'Start Date', width: 140 },
  { id: 'end', label: 'End Date', width: 140 },
  { id: 'products', label: 'Products', width: 120 },
  { id: 'employee', label: 'Employee', width: 140 },
  { id: 'Branch', label: 'Branch', width: 110 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

const start = new Date();
start.setDate(start.getDate() - 60);

const end = new Date();
end.setDate(end.getDate() + 7);

// ----------------------------------------------------------------------

export default function AppointmentListView() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<AppointmentItem[]>([]);

  const defaultstart = new Date();
  defaultstart.setDate(defaultstart.getDate() - 60);

  const defaultend = new Date();
  defaultend.setDate(defaultend.getDate() + 7);

  const filters = useSetState<AppointmentTableFilters>({
    name: '',
    status: 'all',
    startDate: dayjs(start),
    endDate: dayjs(end),
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRow(dataInPage.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.appointments.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.appointments.edit(id));
    },
    [router]
  );

  const handleCreateInvoiceRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.appointments.appointmentinvoice(id));
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

  useEffect(() => {
    if (filters.state.startDate && filters.state.endDate) {
      const datefilter = `startdate=${filters.state.startDate.toISOString()}&enddate=${filters.state.endDate.toISOString()}`;
      fetch(`/api/salonapp/appointments?${datefilter}`)
        .then((response) => response.json())
        // 4. Setting *dogImage* to the image url that we received from the response above
        .then((data) => setTableData(data.data));
    }
  }, [filters.state.startDate, filters.state.endDate]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Appointment',
              href: paths.dashboard.appointments.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.appointments.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Appointment
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
                    color={
                      (tab.value === 'Invoiced' && 'success') ||
                      (tab.value === 'Pendinginvoice' && 'warning') ||
                      'default'
                    }
                  >
                    {['Invoiced', 'Pendinginvoice'].includes(tab.value)
                      ? tableData.filter(
                          (appointment) =>
                            (appointment.is_invoiced ? 'Invoiced' : 'Pendinginvoice') === tab.value
                        ).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <AppointmentTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <AppointmentTableFiltersResult
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
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
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
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <AppointmentTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onCreateInvoiceRow={() => handleCreateInvoiceRow(row.id)}
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
  dateError,
}: {
  inputData: AppointmentItem[];
  comparator: (a: any, b: any) => number;
  filters: AppointmentTableFilters;
  dateError: boolean;
}) {
  const { status, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const appointment = comparator(a[0], b[0]);
    if (appointment !== 0) return appointment;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  /*
  if (!dateError) {
    if (startDate && endDate) {
    
      if (!dateError) {
        if (startDate && endDate) {
        }
      }
    }
  }
  */
  console.log(name);

  if (name) {
    inputData = inputData.filter(
      (appointment) =>
        appointment.Customer.lastname.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        appointment.Customer.firstname.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        appointment.Customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        String(appointment.id).toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((appointment) =>
      appointment.is_invoiced ? 'invoiced' : status === 'pendinginvoice'
    );
  }

  return inputData;
}
