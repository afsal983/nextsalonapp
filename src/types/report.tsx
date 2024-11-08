export type ReportFilterValue = string | string[] | Date | null;

export type SalesReportTableFilterValue =
  | string
  | string[]
  | Date
  | null
  | undefined;

export interface SalesReportTableFilters {
  startDate: Date | null;
  endDate: Date | null;
  filtername: string;
  filterid: number;
}

export type DetailedSalesReportTableFilterValue =
  | string
  | string[]
  | Date
  | null;

export interface DetailedSalesReportTableFilters {
  startDate: Date | null;
  endDate: Date | null;
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

export interface ISalesTableFilters {
  branch: string[];
  status: string[];
  paymenttype: string[];
}

export type ISalesTableFilterValue = string[];

export type IPeriodFilterValue = string[] | Date | null;

export interface IPeriodFilters {
  startDate: Date | null;
  endDate: Date | null;
}

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
