import { _userList } from 'src/_mock/_user'

import { RetailBrandEditView } from 'src/sections/retailbrand/view'

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Retailbrand Edit'
}

interface Props {
  params: {
    id: string
  }
}

export default function RetailbrandEditPage ({ params }: Props) {
  const { id } = params

  return <RetailBrandEditView id={id} />
}

export async function generateStaticParams () {
  return _userList.map((user) => ({
    id: user.id
  }))
}
