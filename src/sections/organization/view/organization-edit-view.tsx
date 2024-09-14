'use client'

import useSWR from 'swr'
import React from 'react'

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { fetcher } from 'src/utils/axios'

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import OrganizationNewEditForm from '../organization-new-edit-form'

// ----------------------------------------------------------------------

interface Props {
  id: string
}

export default function OrganizationEditView ({ id }: Props) {

  const { t } = useTranslate();

  const settings = useSettingsContext()

  // Pre data fetching via API calls
  const { data: organization,isLoading: isorganizationLoading, error: organizationError} = useSWR('/api/salonapp/organization', fetcher);


  if (organizationError ) return <div>Failed to load</div>
  if (!organization ) return <div>Loading...</div>
 
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
            name: t('salonapp.organization.organizations'),
            href: paths.dashboard.organization.root
          },
          { name: organization?.data[0].name }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <OrganizationNewEditForm currentOrganization={organization?.data[0]}  />
    </Container>
  )
}
