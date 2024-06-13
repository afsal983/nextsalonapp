// ----------------------------------------------------------------------

export interface IPaymenttypes {
  id: number
  name: string
  default_paymenttype: boolean
  built_in?: boolean
  is_authcode: boolean
  deleted: boolean
}
