'use client'

import useSWR from 'swr'
import React, { useState } from 'react'

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { fetcher } from 'src/utils/axios'

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import { type IServiceItem, type IServiceCategoryItem } from 'src/types/service'

import ServiceNewEditForm from '../service-new-edit-form'

// ----------------------------------------------------------------------

interface Props {
  id: string
}

export default function ServiceEditView ({ id }: Props) {
  const settings = useSettingsContext()

  // const currentService = _userList.find((user) => user.id === id);
  const [ServiceData, setServiceData] = useState<IServiceItem>()
  const [ServiceCategoryData, setServiceCategoryData] = useState<IServiceCategoryItem[]>([])

  // Get the services
  const { data: serviceData, error: serviceError, isLoading: serviceLoading } = useSWR(
    '/apiserver/products/{id}',
    fetcher,
    {
      onSuccess: (data) => {
        setServiceData(data.data)
      }
    }
  )

  // Get the service categories
  const { data: serviceCategoryData, error: serviceCategoryError, isLoading: serviceCategoryLoading } = useSWR(
    '/apiserver/productcategories?type=1',
    fetcher,
    {
      onSuccess: (data) => {
        setServiceCategoryData(data.data)
      }
    }
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root
          },
          {
            name: 'User',
            href: paths.dashboard.services.root
          },
          { name: ServiceData?.name }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <ServiceNewEditForm currentService={ServiceData} servicecategory={ServiceCategoryData}/>
    </Container>
  )
}
