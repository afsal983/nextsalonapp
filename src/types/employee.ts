
// ----------------------------------------------------------------------

export type ServiceTableFilterValue = string | string[]

export interface ServiceTableFilters {
  name: string
  productcategory: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface Employee {
  id: number
  name: string
  address: string
  telephone: string
  email: string
  braanchid: number
  deleted: number
  user_id: number
}

export interface ServiceCategoryItem {
  id: string
  name: string
  type: number
}
