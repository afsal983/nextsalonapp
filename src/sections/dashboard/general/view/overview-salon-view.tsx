"use client";

import useSWR from "swr";

import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";

import { fetcher } from "src/utils/axios";

import { _ecommerceLatestProducts } from "src/_mock";

import { useSettingsContext } from "src/components/settings";

import LatestTransactions from "../latest-transactions";
import SalonBestCustomer from "../salon-best-customer";
import SalonBestEmployee from "../salon-best-employee";
import SalonDashBoardWidgetSummary from "../salondashboard-widget-summary";
import EcommerceLatestProducts from "../ecommerce-latest-products";

// ----------------------------------------------------------------------

export default function OverviewSalonView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  // Use SWR to fetch data from multiple endpoints in parallel
  const {
    data: appointmentsummary,
    isLoading: isappointmentsummaryLoading,
    error: errorA,
  } = useSWR("/api/salonapp/dashboard/appointmentdashboard", fetcher);
  const {
    data: latestsales,
    isLoading: islatestsalesLoading,
    error: errorL,
  } = useSWR("/api/salonapp/dashboard/latestsales", fetcher);
  const {
    data: revenuebycriteria,
    isLoading: isrevenuebycriteriaLoading,
    error: errorR,
  } = useSWR("/api/salonapp/dashboard/revenuebycriteria", fetcher);
  const {
    data: bestcustomer,
    isLoading: isbestcustomerLoading,
    error: errorB,
  } = useSWR("/api/salonapp/dashboard/bestcustomer", fetcher);
  const {
    data: bestemployee,
    isLoading: isbestemployee,
    error: errorE,
  } = useSWR("/api/salonapp/dashboard/bestemployee", fetcher);

  if (
    isappointmentsummaryLoading ||
    islatestsalesLoading ||
    isrevenuebycriteriaLoading ||
    isbestcustomerLoading ||
    isbestemployee
  )
    return <div>Loading...</div>;
  if (errorA || errorL || errorR || errorB || errorE)
    return <div>Error Loading...</div>;

  console.log(revenuebycriteria);

  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="Today's Sales"
            count={revenuebycriteria.data.salescounttoday}
            total={revenuebycriteria.data.salestoday}
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="Yesterday's sales"
            count={revenuebycriteria.data.salescountyesterday}
            total={revenuebycriteria.data.salesyesterday}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="This week sales"
            count={revenuebycriteria.data.salescountthisweek}
            total={revenuebycriteria.data.salesthisweek}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <SalonDashBoardWidgetSummary
            title="This month sales"
            count={revenuebycriteria.data.salescountthismonth}
            total={revenuebycriteria.data.salesthismonth}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>
        <Grid xs={12}>
          <LatestTransactions
            title="Latest Transactions"
            tableData={latestsales.data}
            tableLabels={[
              { id: "orderid", label: "Order ID" },
              { id: "billingname", label: "Billing Name" },
              { id: "employeename", label: "Employee Name" },
              { id: "date", label: "Date" },
              { id: "total", label: "Total" },
              { id: "paymentstatus", label: "Payment Status" },
              { id: "paymentmethod", label: "Payment Method" },
              { id: "" },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <SalonBestCustomer
            title="Best Customers"
            tableData={bestcustomer.data}
            tableLabels={[
              { id: "customername", label: "Customer" },
              { id: "revenue", label: "Revenue", align: "center" },
              { id: "amount", label: "#Sales", align: "center" },
              { id: "rank", label: "#Rank", align: "right" },
            ]}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <EcommerceLatestProducts
            title="Latest Products"
            list={_ecommerceLatestProducts}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <SalonBestEmployee
            title="Best Employee"
            tableData={bestemployee.data}
            tableLabels={[
              { id: "customername", label: "Employee Name" },
              { id: "revenue", label: "Revenue", align: "center" },
              { id: "amount", label: "#Sales", align: "center" },
              { id: "rank", label: "Rank", align: "right" },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
