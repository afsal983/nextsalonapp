'use client'

import useSWR from 'swr';

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import UserNewEditForm from '../user-new-edit-form'

// ----------------------------------------------------------------------

export default function UserCreateView () {
  const { t } = useTranslate();

  const settings = useSettingsContext()

  // Pre data fetching via API calls
  const { data: userrole,isLoading: isuserroleLoading } = useSWR('/api/salonapp/userrole', fetcher);
  const { data: branches,isLoading: isbranchesLoading } = useSWR('/api/salonapp/branches', fetcher);


  // Wait for data loading
  if ( isuserroleLoading || isbranchesLoading ) return <div>Loading...</div>;
  if (!userrole || !branches ) return <div>Loading...</div>

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={ t('salonapp.user.create_user') }
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root
          },
          {
            name: t('salonapp.users'),
            href: paths.dashboard.user.root
          },
          { name: t('salonapp.user.new_user') }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <UserNewEditForm userroles={userrole?.data} branches={branches?.data} />
    </Container>
  )
}
