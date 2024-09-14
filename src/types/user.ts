import { type BranchItem } from 'src/types/branch'


// ----------------------------------------------------------------------

export type UserTableFilterValue = string | string[]

export interface UserTableFilters {
  name: string
  userrole: string[]
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
  userroledb: UserRoleDB
  branch_id: number
  Branches_organization: BranchItem
  is_default: boolean
}


export interface  UserRoleDB {
  id: string 
  name: string        
  casbin_roleid: string 
  is_default: boolean
}