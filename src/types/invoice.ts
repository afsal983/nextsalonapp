import { Customer } from './customer';
import { BranchItem } from './branch';
import { ServiceItem } from './service';
import { EmployeeItem } from './employee';
import { AppointmentItem } from './appointment';
import type { IDatePickerControl } from './common';
// ----------------------------------------------------------------------

export type IInvoiceTableFilterValue = string | string[] | Date | null;

export interface IInvoiceTableFilters {
  name: string;
  status: string;
  service: string[];
  filtervalue: 0;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
}

// ----------------------------------------------------------------------

export interface IInvoiceItem {
  id: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  type: number;
  employee: number;
  discount: number;
}

export interface IInvoice {
  id: string;
  invoicenumber: string;
  date: string;
  dueDate: string;
  total: number;
  discount: number;
  tax_rate: number;
  tip: number;
  customer_id: number;
  Customer: Customer;
  event_id: number;
  Event: AppointmentItem;
  Invoice_line: Invoice_line[];
  branch_id: number;
  Branches_organization: BranchItem;
  status: number;
  Invstatus: {
    name: string;
  };
  deleted: number;
  Payment: Payment[];
}

export interface Invoice_line {
  id: number;
  quantity: number;
  price: number;
  discount: number;
  invoice_id: number;
  product_id: number;
  Product: ServiceItem;
  employee_id: number;
  Employee: EmployeeItem;
  branch_id: number;
  Branches_organization: BranchItem;
  deleted: number;
}

export interface Payment {
  id: number;
  invoice_id: number;
  value: number;
  payment_type: number;
  auth_code: string;
}

export interface Printinvoice {
  logourl: string;
  mainlogourl: string;
  branchname: string;
  branchaddr: string;
  orgname: string;
  telephone: string;
  taxname: string;
  taxid: string;
  billno: string;
  invoiceid: string;
  date: string;
  guestname: string;
  guestaddress: string;
  guesttelephone: string;
  guesttaxid: string;
  paymenttype: string;
  authcode: string;
  itemheader: [];
  itemlist: [];
  subtotal: string;
  total: string;
  discount: string;
  discountrate: string;
  tax: string;
  sgst: string;
  cgst: string;
  taxrate: string;
  tip: string;
  billamount: string;
  nonroundedbillamount: string;
  customersavings: string;
  footer: string;
}

export interface Products {
  id: number | undefined;
  start: Date;
  end: Date;
  productid: number;
  price: number;
  quantity: number;
  discount: number;
  employeeid: number;
  deleted: number | undefined;
}

export interface Retails {
  id: number | undefined;
  productid: number | undefined;
  price: number | undefined;
  quantity: number;
  discount: number | undefined;
  employeeid: number | undefined;
  deleted: number | undefined;
}

export interface Packages {
  id: number | undefined;
  start: Date;
  end: Date;
  productid: number | undefined;
  price: number;
  quantity: number;
  discount: number | undefined;
  employeeid: number | undefined;
  deleted: Number | undefined;
}

export interface Payments {
  id: number | undefined;
  invoice_id: number | undefined;
  value: number | undefined;
  payment_type: number | undefined;
  auth_code: string | undefined;
}
