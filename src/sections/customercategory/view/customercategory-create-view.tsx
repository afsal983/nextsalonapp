'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CustomerCategoryNewEditForm from '../customercategory-new-edit-form';

// ----------------------------------------------------------------------

export default function CustomerCategoryCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.customer.customercategory.create_customercategory')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.customer_category'),
            href: paths.dashboard.services.servicecategory.root,
          },
          {
            name: t('salonapp.customer.customercategory.create_customercategory'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CustomerCategoryNewEditForm />
    </Container>
  );
}
