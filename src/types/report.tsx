// Report
export type ReportFilterValue = string | string[] | Date | null;

export interface ReportFilters {
  name: string[];
}

export interface Item {
  id: string;
  name: string;
  url: string;
}

export interface IReportItem {
  category: string;
  items: Item[];
}

// Sales Report
export interface SalesReportTableFilters {
  branch: string[];
  status: string[];
  paymenttype: string[];
}

export type SalesReportTableFilterValue = string | string[] | Date | null;

export interface SalesReportPeriodFilters {
  startDate: Date | null;
  endDate: Date | null;
}

export type SalesReportPeriodFilterValue = string[] | Date | null;

// export type DetailedSalesReportTableFilterValue = string[];

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

// Customer Report
export interface CustomerReportTableFilters {
  category: string[];
  sex: string[];
}

export type CustomerReportTableFilterValue = string | string[] | Date | null;

export interface CustomerReportPeriodFilters {
  startDate: Date | null;
  endDate: Date | null;
}

export type CustomerReportPeriodFilterValue = string[] | Date | null;

export interface CustomerReport {
  id: string;
  customerinfo: {
    name: string;
    category: string;
  };
  email: string;
  sex: string;
  category: string;
  dob: string;
  taxid: string;
  cardno: string;
  eventnotify: string;
  promonotify: string;
}

// Product Report
export interface ProductReportTableFilters {
  category: string[];
  type: string[];
}

export type ProductReportTableFilterValue = string | string[] | Date | null;

export interface ProductReportPeriodFilters {
  startDate: Date | null;
  endDate: Date | null;
}

export type ProductReportPeriodFilterValue = string[] | Date | null;

export interface ProductReport {
  id: string;
  productinfo: {
    name: string;
    category: string;
  };
  price: string;
  category: string;
  type: string;
  duration: string;
  stock: string;
  brand: string;
}
