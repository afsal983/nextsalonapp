'use client';

import sumBy from 'lodash/sumBy';
import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { CSVLink, CSVDownload } from "react-csv";


import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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

import { IInvoice, IInvoiceTableFilters, IInvoiceTableFilterValue } from 'src/types/invoice';

import InvoiceTableRow from './salesreport-table-row';
import InvoiceTableToolbar from './salesreport-table-toolbar';
import InvoiceTableFiltersResult from './salesreport-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'serial', label: 'Serial' },
  { id: 'invoicenumber', label: 'Invoice Number' },
  { id: 'date', label: 'Date' },
  { id: 'invoicevalue', label: 'Invoice Value' },
  { id: 'sgst', label: 'CGST' },
  { id: 'cgst', label: 'CGST' },
  { id: 'tax', label: 'TAX' },
  { id: 'name', label: 'Name' },
  { id: 'branchname', label: 'Branch Name' },
  { id: 'status', label: 'Status' },
  { id: '' },
];

const FILTER_OPTIONS = [
  { id: 'all', name: 'All Sales', value:"all" },
  { id: 'detailedsales', name: 'Detailed Sales', value:"detailedsales" },
  { id: 'salesb', name: 'Sales By Branch', value:"salesb"},
  { id: 'salesbycus', name: 'Sales By Customer', value:"salesbycus" },
]

const defaultFilters: IInvoiceTableFilters = {
  name: '',
  filtername: "",
  filtervalue: 0,
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------
type Props = {
  reportid: string;
};

export default function SalesReportDetailsView({ reportid }: Props) {

  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IInvoice[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

   // Use SWR to fetch data from multiple endpoints in parallel
  // const { data: invoice,isLoading: isinvoiceLoading,  error: errorI } = useSWR('/api/salonapp/report/salesreport', fetcher);

  /*
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });
  */
 const dataFiltered = tableData

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name ||
    !!filters.filtername ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status: string) =>
    tableData.filter((item) => item?.Invstatus.name === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item?.Invstatus.name === status),
      'totalAmount'
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / tableData.length) * 100;



  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: tableData.length },
    {
      value: 'paid',
      label: 'Paid',
      color: 'success',
      count: getInvoiceLength('paid'),
    },
    {
      value: 'pending',
      label: 'Pending',
      color: 'warning',
      count: getInvoiceLength('pending'),
    },
    {
      value: 'overdue',
      label: 'Overdue',
      color: 'error',
      count: getInvoiceLength('overdue'),
    },
    {
      value: 'draft',
      label: 'Draft',
      color: 'default',
      count: getInvoiceLength('draft'),
    },
  ] as const;

  const handleFilters = useCallback(
    (name: string, value: IInvoiceTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const  handleSearch  = async () => {

    const filter = FILTER_OPTIONS.find((item) => item.name === filters.filtername)

    const data = {
      "start" : filters.startDate,
      "end": filters.endDate,
      "filtername": filter?.value,
      "filterid":1
    }
    const response = await fetch('/api/salonapp/report/salesreport', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const responseData = await response.json()

    

    setTableData(responseData.data)
  };

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const headers = [
    'Invoice Number',
    'Total',
    'Tip',
    'Customer First Name',
    'Customer Last Name',
    'Date',
    'Invoice Status',
    'Branch Name',
  ];

  const getcsvData = useCallback(
    () => {
      const csvData = [
        headers,
        ...dataFiltered.map(({ invoicenumber, total, tip, Customer, date, Invstatus, Branches_organization }) => [
          invoicenumber,
          total,
          tip,
          Customer.firstname ,
          Customer.lastname ,
          date,
          Invstatus.name,
          Branches_organization.name,
        ]),
      ];
      console.log(csvData)
      return csvData
    },
    [dataFiltered]
  );


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            {
              name: t('salonapp.dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('salonapp.invoice.invoice'),
              href: paths.dashboard.invoice.root,
            },
            {
              name: t('general.report'),
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <InvoiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            handleSearch={handleSearch}
            //
            dateError={dateError}
            serviceOptions={FILTER_OPTIONS.map((option) => option.name)}
            getcsvData= {getcsvData}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
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
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
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
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
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
      </Container>
    </>
  );
}