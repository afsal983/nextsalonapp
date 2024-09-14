'use client'

import useSWR from 'swr';

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import BranchNewEditForm from '../branch-new-edit-form'

// ----------------------------------------------------------------------

export default function BranchCreateView () {
  const { t } = useTranslate();

  const settings = useSettingsContext()

    // Pre data fetching via API calls
    const { data: organization,isLoading: isorganizationLoading } = useSWR('/api/salonapp/organization', fetcher);
    const { data: location,isLoading: islocationLoading } = useSWR('/api/salonapp/location', fetcher);

  
    // Wait for data loading
    if ( isorganizationLoading || islocationLoading ) return <div>Loading...</div>;
    if (!organization  || !location ) return <div>Loading...</div>


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={ t('salonapp.branch.create_branch') }
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root
          },
          {
            name: t('salonapp.branch.branches'),
            href: paths.dashboard.branches.root
          },
          { name: t('salonapp.branch.create_branch') }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <BranchNewEditForm organization={organization.data} location={location.data}/>
    </Container>
  )
}
