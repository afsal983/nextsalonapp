import { type IAddressItem } from './address'

// ----------------------------------------------------------------------

export type IInvoiceTableFilterValue = string | string[] | Date | null

export interface IInvoiceTableFilters {
  name: string
  service: string[]
  status: string
  startDate: Date | null
  endDate: Date | null
}

// ----------------------------------------------------------------------

export interface IInvoiceItem {
  id: string
  title: string
  price: number
  total: number
  service: string
  quantity: number
  description: string
}

export interface IInvoice {
  id: string
  sent: number
  dueDate: Date
  taxes: number
  status: string
  subTotal: number
  createDate: Date
  discount: number
  shipping: number
  totalAmount: number
  invoiceNumber: string
  items: IInvoiceItem[]
  invoiceTo: IAddressItem
  invoiceFrom: IAddressItem
}
