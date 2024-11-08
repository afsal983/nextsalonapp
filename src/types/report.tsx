export type ReportFilterValue = string | string[] | Date | null;

export type SalesReportTableFilterValue =
  | string
  | string[]
  | Date
  | null
  | undefined;

export interface SalesReportTableFilters {
  name: string | null;
  startDate: Date | null;
  endDate: Date | null;
  filtername: string;
  filterid: string;
  status: string;
}

export interface IReportItem {
  category: string;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  url: string;
}

export interface ReportFilters {
  name: string[];
}

// DetailedSales Report

export interface DetailedSalesReportTableFilters {
  branch: string[];
  status: string[];
  paymenttype: string[];
}

export type DetailedSalesReportTableFilterValue =
  | string
  | string[]
  | Date
  | null;

export interface DetailedSalesReportPeriodFilters {
  startDate: Date | null;
  endDate: Date | null;
}

export type DetailedSalesReportPeriodFilterValue = string[] | Date | null;

// export type DetailedSalesReportTableFilterValue = string[];

export interface DetailedInvoice {
  id: string;
  serial: string;
  invoicenumber: string;
  date: string;
  billingname: string;
  employee: string;
  tip: string;
  item: {
    name: string;
    category: string;
    onViewRow: string;
  };
  paymentmode: string;
  itemquantity: string;
  unitprice: string;
  total: string;
  discount: string;
  branch: string;
  invstatus: string;
}
