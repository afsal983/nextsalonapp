
// ----------------------------------------------------------------------


export type ServiceTableFilterValue = string | string[]

export interface ServiceTableFilters {
  name: string
  productcategory: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface Customer {
  id: number
  firstname: string
  lastname: string
  comment: string
  address: string
  telephone: string
  email: string
  sex: number
  dob: string
  deleted: number
  category_id: number
  taxid: string
  cardno: string
  CustomerPreference : {
    customer_id: number
    eventnotify: boolean
    promonotify: boolean
    dummy:       boolean
  }
}

export interface Customercategory {
  id: number
  name: string
  discount: number
  default_category: boolean
}
export interface ServiceCategoryItem {
  id: string
  name: string
  type: number
}
