// ----------------------------------------------------------------------

export interface IPaymenttypes {
  id: number
  name: string
  default_paymenttype: boolean
  built_in?: boolean
  is_authcode: boolean
  deleted: boolean
}

export interface PaymentTypeItem {
  id: string 
  name: string 
  description: string 
  default_paymenttype: boolean
  built_in?: boolean
  is_authcode: boolean
  deleted: boolean
}

// ----------------------------------------------------------------------

export type PaymentTypeFilterValue = string | string[]


export interface PaymentTypeTableFilters {
  name: string
  status: string
}



