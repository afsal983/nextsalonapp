import { ServiceCreateView } from 'src/sections/service/view'

import { fetchWithAuth } from '../../../../utils/fetch'

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Create new service'
}

export default async function UserCreatePage () {
  const servicecategory = await fetchWithAuth('/apiserver/productcategories?type=1')

  return <ServiceCreateView servicecategory={servicecategory.data}/>
}
