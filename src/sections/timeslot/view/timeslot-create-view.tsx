'use client'


import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import TimeSlotNewEditForm from '../timeslot-new-edit-form'

// ----------------------------------------------------------------------

export default function TimeSlotCreateView () {
  const { t } = useTranslate();

  const settings = useSettingsContext()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={ t('salonapp.service.timeslot.create_a_new_servicecategory') }
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root
          },
          {
            name: t('salonapp.service_category'),
            href: paths.dashboard.employees.timeslots.root
          },
          { name: t('salonapp.service.timeslot.create_a_new_servicecategory') }
        ]}
        sx={{
          mb: { xs: 3, md: 5 }
        }}
      />

      <TimeSlotNewEditForm/>
    </Container>
  )
}
