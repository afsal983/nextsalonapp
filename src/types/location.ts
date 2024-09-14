
// ----------------------------------------------------------------------

export type LocationTableFilterValue = string | string[]

export interface LocationTableFilters {
  name: string
  location: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface LocationItem {

    loc_id: string
    name: string
    address: string
    telephone: string
    location_url: string

}

export interface ServiceCategoryItem {
  id: string
  name: string
  type: number
}
