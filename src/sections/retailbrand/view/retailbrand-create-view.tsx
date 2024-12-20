'use client';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RetailNewEditForm from '../retailbrand-new-edit-form';

// ----------------------------------------------------------------------

export default function RetailCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.retail.create_a_new_retail')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.retails'),
            href: paths.dashboard.retails.root,
          },
          { name: t('salonapp.retail.new_retail') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RetailNewEditForm />
    </DashboardContent>
  );
}
