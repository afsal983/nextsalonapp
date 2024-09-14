
// ----------------------------------------------------------------------

export type OrganizationTableFilterValue = string | string[]

export interface OrganizationTableFilters {
  name: string
  location: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface OrganizationItem {
    org_id: string
    name: string
    address: string
    telephone: string
    email: string
}

export interface ServiceCategoryItem {
  id: string
  name: string
  type: number
}
