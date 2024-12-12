'use client';

import useSWR from 'swr';

import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { fetcher } from 'src/utils/axios';

import Loading from 'src/app/loading';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';

import BestProducts from '../salon-best-product';
import SalonYearlySales from '../salon-yearly-sales';
import CustomerByGender from '../customer-by-gender';
import AppointmentEvents from '../appointment-events';
import SalonBestCustomer from '../salon-best-customer';
import SalonBestEmployee from '../salon-best-employee';
import AppointmentSource from '../appointment-sources';
import LatestTransactions from '../latest-transactions';
import SalonDashBoardWidgetSummary from '../salondashboard-widget-summary';

// ----------------------------------------------------------------------

export default function OverviewSalonView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  // Use SWR to fetch data from multiple endpoints in parallel
  const {
    data: appointmentsummary,
    isLoading: isappointmentsummaryLoading,
    error: errorA,
  } = useSWR('/api/salonapp/dashboard/appointmentdashboard', fetcher);
  const {
    data: latestsales,
    isLoading: islatestsalesLoading,
    error: errorL,
  } = useSWR('/api/salonapp/dashboard/latestsales', fetcher);
  const {
    data: revenuebycriteria,
    isLoading: isrevenuebycriteriaLoading,
    error: errorR,
  } = useSWR('/api/salonapp/dashboard/revenuebycriteria', fetcher);
  const {
    data: bestcustomer,
    isLoading: isbestcustomerLoading,
    error: errorB,
  } = useSWR('/api/salonapp/dashboard/bestcustomer', fetcher);
  const { data: bestemployee, isLoading: isbestemployee } = useSWR(
    '/api/salonapp/dashboard/bestemployee',
    fetcher
  );

  const { data: appointment, isLoading: isappoitnment } = useSWR(
    '/api/salonapp/dashboard/appointmentdashboard',
    fetcher
  );

  const { data: yearlysales, isLoading: isyearlysales } = useSWR(
    '/api/salonapp/dashboard/yearlysales?periodfilter=thisyear',
    fetcher
  );

  const { data: bestproducts, isLoading: isbestproducts } = useSWR(
    '/api/salonapp/dashboard/bestproducts?periodfilter=lasttwomonths',
    fetcher
  );

  const { data: customerbygender, isLoading: iscustomerbygender } = useSWR(
    '/api/salonapp/dashboard/customerbygender',
    fetcher
  );

  const { data: appointmentsources, isLoading: isappointmentsources } = useSWR(
    '/api/salonapp/dashboard/appointmentsource',
    fetcher
  );

  if (
    isappointmentsummaryLoading ||
    islatestsalesLoading ||
    isrevenuebycriteriaLoading ||
    isbestcustomerLoading ||
    isbestemployee ||
    isappoitnment ||
    isyearlysales ||
    isbestproducts ||
    iscustomerbygender ||
    isappointmentsources
  )
    return <Loading />;
  if (errorA || errorL || errorR || errorB) return <div>Error Loading...</div>;

  return (
    <DashboardContent>
      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="Today's Sales"
            count={revenuebycriteria.data?.salescounttoday}
            total={revenuebycriteria.data?.salestoday}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="Yesterday's sales"
            count={revenuebycriteria.data?.salescountyesterday}
            total={revenuebycriteria.data?.salesyesterday}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="This week sales"
            count={revenuebycriteria.data?.salescountthisweek}
            total={revenuebycriteria.data?.salesthisweek}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="This month sales"
            count={revenuebycriteria.data?.salescountthismonth}
            total={revenuebycriteria.data?.salesthismonth}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <LatestTransactions
              title="Latest Transactions"
              tableData={latestsales?.data}
              tableLabels={[
                { id: 'orderid', label: 'Order ID' },
                { id: 'billingname', label: 'Billing Name' },
                { id: 'employeename', label: 'Employee Name' },
                { id: 'date', label: 'Date' },
                { id: 'total', label: 'Total' },
                { id: 'paymentstatus', label: 'Status' },
                { id: 'paymentmethod', label: 'Mode' },
                { id: '' },
              ]}
            />

            {appointment?.data?.upcomingevents.len !== 0 && (
              <AppointmentEvents
                title="Upcoming appointments"
                tableData={appointment?.data?.upcomingevents}
                tableLabels={[
                  { id: 'customer', label: 'Customer' },
                  { id: 'date', label: 'Date' },
                  { id: 'product', label: 'Product' },
                  { id: 'employee', label: 'Employee', align: 'right' },
                  { id: '' },
                ]}
              />
            )}

            <SalonYearlySales
              title="Yearly Sales"
              subheader="(+43%) than last year"
              chart={{
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                series: [
                  {
                    year: yearlysales?.thisyearname,
                    data: [
                      {
                        name: 'Total Sales',
                        data: yearlysales?.thisyear,
                      },
                      /*
                      {
                        name: "Total Expenses",
                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                      },
                      */
                    ],
                  },
                  {
                    year: yearlysales?.lastyearname,
                    data: [
                      {
                        name: 'Total Sales',
                        data: yearlysales?.lastyear,
                      },
                      /*
                      {
                        name: "Total Expenses",
                        data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                      },
                      */
                    ],
                  },
                ],
              }}
            />

            <SalonBestCustomer
              title="Best Customers"
              subheader="In this month"
              tableData={bestcustomer.data}
              tableLabels={[
                { id: 'customername', label: 'Customer' },
                { id: 'revenue', label: 'Revenue', align: 'center' },
                { id: 'amount', label: '#Sales', align: 'center' },
                { id: 'rank', label: '#Rank', align: 'right' },
              ]}
            />

            <SalonBestEmployee
              title="Best Employee"
              subheader="Last two months"
              tableData={bestemployee.data}
              tableLabels={[
                { id: 'customername', label: 'Employee Name' },
                { id: 'revenue', label: 'Revenue', align: 'center' },
                { id: 'amount', label: '#Sales', align: 'center' },
                { id: 'rank', label: 'Rank', align: 'right' },
              ]}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <BestProducts
              title="Top Selling Products"
              subheader="Last two months"
              list={bestproducts?.data}
            />

            <CustomerByGender
              title="Customer By Gender"
              total={customerbygender?.total}
              chart={{
                series: customerbygender?.data,
              }}
            />
            <AppointmentSource
              title="Appointment Sources"
              chart={{
                series: appointmentsources?.data,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
