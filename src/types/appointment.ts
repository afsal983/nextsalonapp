import { BranchItem } from "./branch";
import { Customer } from "./customer";
import { ServiceItem } from "./service";
import { EmployeeItem } from "./employee";
// ----------------------------------------------------------------------

export type AppointmentTableFilterValue = string | Date | null;

export interface AppointmentTableFilters {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

// ----------------------------------------------------------------------

export interface AppointmentItem {
  id: string;
  name: string;
  start: Date;
  end: Date;
  resource: string;
  customer_id: string;
  Customer: Customer;
  product_id: string;
  Product: ServiceItem;
  employee_id: string;
  Employee: EmployeeItem;
  branch_id: string;
  Branches_organization: BranchItem;
  Reminder_count: number;
  Additional_products: Additional_products[];
  is_invoiced: boolean;
  notes: string;
  type: number;
}

export interface Additional_products {
  id: string;
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
