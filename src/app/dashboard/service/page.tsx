import { ServiceListView } from "src/sections/service/view";
import { fetchWithAuth, fetchInParallelWithAuth } from '../../../utils/fetch';
import { endpoints } from "../../../utils/fetch";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Dashboard: Service Profile",
};

export default async function ServicesPage() {

  const results = await fetchInParallelWithAuth([endpoints.product.list,endpoints.productcategory.list])

  //console.log(results)
  //const services = await fetchWithAuth(endpoints.product.list, token);
  //const servicecategory = await fetchWithAuth(endpoints.productcategory.list , token);

  return <ServiceListView services={results[0].data} servicecategory={results[1].data}/>;
}

