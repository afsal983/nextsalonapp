'use client'


import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import ServiceNewEditForm from '../service-new-edit-form'

// ----------------------------------------------------------------------

export default function ServiceCreateView ({ servicecategory }: any) {
  const settings = useSettingsContext()

  // const [productCategory, setproductCategory] = useState<ServiceCategoryItem[]>(servicecategory);
  // Get the all the service categories
  // const result = useSWR("/apiserver/productcategories?type=1", fetcher, {
  //  onSuccess: (data) => {
  //    const category = data.data.map((item: IServiceItem) => item.name);
  //    setproductCategory(data.data); // this seems to use fetched data as needed without useEffect
  //   },
  // });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new service"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root
          },
          {
            name: 'Services',
            href: paths.dashboard.services.root
          },
          { name: 'New Service' }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <ServiceNewEditForm servicecategory={servicecategory}/>
    </Container>
  )
}
