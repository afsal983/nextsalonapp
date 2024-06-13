
// ----------------------------------------------------------------------

export type ServiceTableFilterValue = string | string[]

export interface ServiceTableFilters {
  name: string
  productcategory: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface Branches_organization {
    branch_id: number
    name: string
    address: string
    telephone: string

}

export interface ServiceCategoryItem {
  id: string
  name: string
  type: number
}
