
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
  price: number
  total: number
  service: string
  quantity: number
  type: number
  employee: number
  discount: number
}

export interface IInvoice {

    id: string
    invoicenumber : string
    date: string
    total: number
    discount: number
    tax_rate: number
    tip: number
    customer_id: number
    Customer: {
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
    },
    Invoice_line: 
    {
      id: number
      quantity: number
      price: number,
      discount:number
      invoice_id: number
      product_id: number
      Product: {
          id: number
          name: string
          price: number
          type: number
          duration: number
          commission: number
          sku: string
          stock: number
          color: string
          brand_id: number
          category_id: number
          deleted: number
          tax: number
      },
      employee_id: number
      Employee: {
          id: number
          name: string
          address: string
          telephone: string
          email: string
          branch_id: string
          deleted: string
          user_id: 45,
          avatarimagename: string
      },
      branch_id: number
      Branches_organization : {
        branch_id: number
        name: string
        address: string
        telephone: string
      }
      deleted: number
    }[],
    branch_id: number
    Branches_organization : {
      branch_id: number
      name: string
      address: string
      telephone: string
    }
    status: number
    Invstatus :{
      name: string
    }
    deleted: number
    Payment: Payment[]
}

export interface Payment {
  id: number
  invoice_id: number
  value: number
  payment_type: number
  auth_code: string
}