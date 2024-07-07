import { _userList } from 'src/_mock/_user'

import { PaymentTypeEditView } from 'src/sections/paymenttype/view'

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: PaymentType Edit'
}

interface Props {
  params: {
    id: string
  }
}

export default function PaymentTypeEditPage ({ params }: Props) {
  const { id } = params

  return <PaymentTypeEditView id={id} />
}

export async function generateStaticParams () {
  return _userList.map((user) => ({
    id: user.id
  }))
}
