import { type UserItem } from 'src/types/user';
import { type BranchItem } from 'src/types/branch';

import { ServiceItem } from './service';
// ----------------------------------------------------------------------

export type EmployeeTableFilterValue = string | string[];
export type TimeSlotTableFilterValue = string | string[];

export interface EmployeeTableFilters {
  name: string;
  branches: string[];
  status: string;
}

export interface TimeSlotTableFilters {
  name: string;
  status: string;
}

// ----------------------------------------------------------------------

export interface EmployeeItem {
  id: string;
  name: string;
  address: string;
  telephone: string;
  email: string;
  deleted: number;
  branch_id: number;
  Branches_organization: BranchItem;
  user_id: number;
  user: UserItem;
  employeeservice: EmployeeService[];
  employeesettings: EmployeeSettings;
  avatarimagename: string;
}

export interface EmployeeService {
  employee_id: number;
  service_id: number;
  Product: ServiceItem;
}

export interface EmployeeSettings {
  employee_id: number;
  working_plan: string;
  working_plan_exceptions: string;
  notifications: boolean;
  google_sync: boolean;
  google_calendar: string;
  sync_past_days: string;
  sync_future_days: string;
  calendar_view: string;
}

export interface TimeSlotItem {
  id: string;
  name: string;
  desc: string;
  starttime: string;
  endtime: string;
  built_in: boolean;
}

export interface WorkScheduleItem {
  employee_id: number;
  day: number;
  timeslotid: number;
}

export interface Schedule {
  employee_id: number;
  dayschedule: DaySchedule[];
}

export interface DaySchedule {
  day: number;
  slots: {
    id: number;
    name: string;
  }[];
}
