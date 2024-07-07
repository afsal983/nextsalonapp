import { _userList } from 'src/_mock/_user'

import { EmployeeEditView } from 'src/sections/employee/view'

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Employee Edit'
}

interface Props {
  params: {
    id: string
  }
}

export default function EmployeeEditPage ({ params }: Props) {
  const { id } = params

  return <EmployeeEditView id={id} />
}

export async function generateStaticParams () {
  return _userList.map((user) => ({
    id: user.id
  }))
}
