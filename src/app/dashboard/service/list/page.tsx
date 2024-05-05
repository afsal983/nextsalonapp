

import { ServiceListView } from 'src/sections/service/view'

import { fetchWithAuth } from '../../../../utils/fetch'

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Service List'
}

export default async function ServiceListPage (context: any) {
  const services = await fetchWithAuth('/apiserver/products?type=1')
  const servicecategory = await fetchWithAuth('/apiserver/productcategories?type=1')

  console.log(services.data)
  return <ServiceListView services={services.data} servicecategory={servicecategory.data}/>
}
