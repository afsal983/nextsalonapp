'use client'

import useSWR from 'swr'
import React from 'react'

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { fetcher } from 'src/utils/axios'

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import ServiceNewEditForm from '../service-new-edit-form'

// ----------------------------------------------------------------------

interface Props {
  id: string
}

export default function ServiceEditView ({ id }: Props) {

  const { t } = useTranslate();

  const settings = useSettingsContext()

  // Pre data fetching via API calls
  const { data: serviceData , error: serviceError} = useSWR( `/api/salonapp/services/${id}`, fetcher)
  const { data: servicecategoryData , error: categoryError } = useSWR( `/api/salonapp/servicecategory`, fetcher)
  const { data: retailbrands,error: retailbrandError } = useSWR('/api/salonapp/retailbrands', fetcher);

  if (serviceError || categoryError  || retailbrandError) return <div>Failed to load</div>
  if (!serviceData  || !servicecategoryData || !retailbrands) return <div>Loading...</div>
 
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root
          },
          {
            name: t('salonapp.services'),
            href: paths.dashboard.services.servicecategory.root
          },
          { name: serviceData?.data[0].name }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <ServiceNewEditForm currentService={serviceData?.data[0]} servicecategory={servicecategoryData?.data} retailbrands={retailbrands.data}/>
    </Container>
  )
}
