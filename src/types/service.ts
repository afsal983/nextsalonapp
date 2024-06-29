
// ----------------------------------------------------------------------

export type ServiceTableFilterValue = string | string[]
export type ServiceCategoryTableFilterValue = string | string[]

export interface ServiceTableFilters {
  name: string
  productcategory: string[]
  status: string
}

export interface ServiceCategoryTableFilters {
  name: string
  status: string
}

// ----------------------------------------------------------------------

export interface ServiceItem {
  id: string
  name: string
  price: number
  tax: number
  duration: number
  commission: number
  color: string
  category_id: number
  ProductCategory: {
    name: string
  }
  type: number
  status: string
  category: number
  ProductPreference: {
    product_id: number
    on_top: boolean
  }
}

export interface ServiceCategoryItem {
  id: string
  name: string
  type: number
}
