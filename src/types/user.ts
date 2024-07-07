import { type CustomFile } from 'src/components/upload'
import { type Branches_organization } from 'src/types/branches_organizations'

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[]

export interface IUserTableFilters {
  name: string
  role: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface UserItem {
  id: string
  name: string
  password: string
  pin: string
  domain_id: string
  firstname: string
  lastname: string
  comment: string
  email: string
  address: string
  telephone: string
  cdate: string
  enabled: boolean
  acc_lockout: number
  deleted: number
  role_id: number
  branch_id: number
  branches_organization: Branches_organization
  is_default: boolean
}

