import { _userList } from 'src/_mock/_user'

import { ServiceEditView } from 'src/sections/service/view'

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Service Edit'
}

interface Props {
  params: {
    id: string
  }
}

export default function ServiceEditPage ({ params }: Props) {
  const { id } = params

  return <ServiceEditView id={id} />
}

export async function generateStaticParams () {
  return _userList.map((user) => ({
    id: user.id
  }))
}
