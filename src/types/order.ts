// ----------------------------------------------------------------------

export type IOrderTableFilterValue = string | Date | null

export interface IOrderTableFilters {
  name: string
  status: string
  startDate: Date | null
  endDate: Date | null
}

// ----------------------------------------------------------------------

export interface IOrderHistory {
  orderTime: Date
  paymentTime: Date
  deliveryTime: Date
  completionTime: Date
  timeline: Array<{
    title: string
    time: Date
  }>
}

export interface IOrderShippingAddress {
  fullAddress: string
  phoneNumber: string
}

export interface IOrderPayment {
  cardType: string
  cardNumber: string
}

export interface IOrderDelivery {
  shipBy: string
  speedy: string
  trackingNumber: string
}

export interface IOrderCustomer {
  id: string
  name: string
  email: string
  avatarUrl: string
  ipAddress: string
}

export interface IOrderProductItem {
  id: string
  sku: string
  name: string
  price: number
  coverUrl: string
  quantity: number
}

export interface IOrderItem {
  id: string
  taxes: number
  status: string
  shipping: number
  discount: number
  subTotal: number
  orderNumber: string
  totalAmount: number
  totalQuantity: number
  history: IOrderHistory
  customer: IOrderCustomer
  delivery: IOrderDelivery
  items: IOrderProductItem[]
  createdAt: Date
}
