'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import RetailNewEditForm from '../paymenttype-new-edit-form';

// ----------------------------------------------------------------------

export default function RetailCreateView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={t('salonapp.paymenttype.create_new_paymenttype')}
        links={[
          {
            name: t('salonapp.dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('salonapp.paymenttype.paymenttype'),
            href: paths.dashboard.retails.root,
          },
          { name: t('salonapp.paymenttype.new_paymenttype') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RetailNewEditForm />
    </DashboardContent>
  );
}
