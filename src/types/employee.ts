import { type Branches_organization } from 'src/types/branches_organizations'
import { type UserItem } from 'src/types/user'
// ----------------------------------------------------------------------

export type EmployeeTableFilterValue = string | string[]

export interface EmployeeTableFilters {
  name: string
  branches: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface EmployeeItem {
  id: string
  name: string
  address: string
  telephone: string
  email: string
  deleted: number
  branch_id: number
  Branches_organization: Branches_organization
  user_id: number
  user: UserItem
  employeeservice: EmployeeService[]   
  employeesettings: EmployeeSettings      
  avatarimagename: string
}


export interface EmployeeService {
  employee_id: number
  service_id:  number
}

export interface EmployeeSettings {
  employee_id: number
  working_plan:  string
  working_plan_exceptions: string
  notifications: boolean
  google_sync: boolean
  google_calendar: string
  sync_past_days: string
  sync_future_days: string
  calendar_view: string

}

