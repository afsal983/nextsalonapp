'use client'

import useSWR from 'swr';

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import OrganizationNewEditForm from '../organization-new-edit-form'

// ----------------------------------------------------------------------

export default function OrganizationCreateView () {
  const { t } = useTranslate();

  const settings = useSettingsContext()

    // Pre data fetching via API calls
    const { data: organization,isLoading: isorganizationLoading } = useSWR('/api/salonapp/organization', fetcher);

  
    // Wait for data loading
    if ( isorganizationLoading  ) return <div>Loading...</div>;
    if (!organization   ) return <div>Loading...</div>


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={ t('salonapp.organization.create_organization') }
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root
          },
          {
            name: t('salonapp.organization.organizations'),
            href: paths.dashboard.organization.root
          },
          { name: t('salonapp.organization.create_organization') }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <OrganizationNewEditForm />
    </Container>
  )
}
