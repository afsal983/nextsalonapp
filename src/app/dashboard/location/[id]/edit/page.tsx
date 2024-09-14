import { _userList } from 'src/_mock/_user'

import { LocationEditView } from 'src/sections/location/view'

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Location Edit'
}

interface Props {
  params: {
    id: string
  }
}

export default function LocationEditPage ({ params }: Props) {
  const { id } = params

  return <LocationEditView id={id} />
}

export async function generateStaticParams () {
  return _userList.map((user) => ({
    id: user.id
  }))
}
