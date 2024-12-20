'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ServiceCategoryNewEditForm from '../servicecategory-new-edit-form';

// ----------------------------------------------------------------------

export default function ServiceCategoryCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.service.servicecategory.create_a_new_servicecategory')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.service_category'),
            href: paths.dashboard.services.servicecategory.root,
          },
          {
            name: t('salonapp.service.servicecategory.create_a_new_servicecategory'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceCategoryNewEditForm />
    </DashboardContent>
  );
}
