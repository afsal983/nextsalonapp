import { BranchItem } from './branch';
import { Customer } from './customer';
import { ServiceItem } from './service';
import { EmployeeItem } from './employee';
import type { IDatePickerControl } from './common';
// ----------------------------------------------------------------------

export type AppointmentTableFilterValue = string | Date | null;

export interface AppointmentTableFilters {
  name: string;
  status: string;
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
}

// ----------------------------------------------------------------------

export interface AppointmentItem {
  id: string;
  name: string;
  start: Date;
  end: Date;
  resource: string;
  customer_id: number;
  Customer: Customer;
  product_id: number;
  Product: ServiceItem;
  employee_id: number;
  Employee: EmployeeItem;
  branch_id: number;
  Branches_organization: BranchItem;
  Reminder_count: number;
  Additional_products: Additional_products[];
  is_invoiced: boolean;
  notes: string;
  type: number;
}

export interface Additional_products {
  id: number;
  event_id: number;
  start: Date;
  end: Date;
  product_id: number;
  Product: ServiceItem;
  employee_id: number;
  Employee: EmployeeItem;
  deleted: number;
}

export type AppointmentDate = string | number;
