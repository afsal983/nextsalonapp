import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { MuiColorInput } from 'mui-color-input';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, RHFSelect, RHFTextField } from 'src/components/hook-form';

import {
  type ServiceItem,
  type RetailBrandItem,
  type ServiceCategoryItem,
} from 'src/types/service';

// ----------------------------------------------------------------------

interface Props {
  currentService?: ServiceItem;
  servicecategory: ServiceCategoryItem[];
  retailbrands: RetailBrandItem[];
}
export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

const NewProductSchema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, { message: 'salonapp.service.name_fvalid_error' }),
  duration: zod
    .number()
    .positive({ message: 'general.must_be_non_zero' })
    .refine((val) => val !== undefined, { message: 'salonapp.service.duration_fvalid_error' }),
  tax: zod.number().refine((val) => val !== undefined, { message: 'general.tax_fvalid_error' }),
  color: zod.string().min(1, { message: 'general.color_fvalid_error' }),
  price: zod
    .number()
    .positive({ message: 'general.must_be_non_zero' })
    .refine((val) => val !== undefined, { message: 'general.price_fvalid_error' }),
  category_id: zod
    .number()
    .positive({ message: 'general.must_be_non_zero' })
    .refine((val) => val !== undefined, { message: 'general.category_fvalid_error' }),
  brand_id: zod.number().optional(),
  sku: zod.string().optional(),
  stock: zod.number().optional(),
  commission: zod.number().optional(),
  type: zod.number().optional(),
  on_top: zod.boolean().optional(),
});

export default function ServiceNewEditForm({
  currentService,
  servicecategory,
  retailbrands,
}: Props) {
  const router = useRouter();

  const [color, setColor] = useState(currentService?.color || '#FFFFFF');

  const { t } = useTranslate();

  const defaultValues = useMemo(
    () => ({
      id: currentService?.id || '0',
      name: currentService?.name || '',
      duration: currentService?.duration || 30,
      tax: currentService?.tax || 0,
      color: currentService?.color || '#ffffff',
      price: currentService?.price || 0.0,
      category_id: currentService?.category_id || 0,
      brand_id: currentService?.brand_id || 0,
      sku: currentService?.sku || '',
      stock: currentService?.stock || 0,
      commission: currentService?.commission,
      type: currentService?.type || 1,
      on_top: currentService?.ProductPreference.on_top || false,
    }),
    [currentService]
  );

  const methods = useForm<NewProductSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleChange = (newcolor: string) => {
    setValue('color', newcolor);
  };
  const type = watch('type');
  const onSubmit = handleSubmit(async (data) => {
    const productData = {
      id: Number(data.id),
      name: data.name,
      duration: data.duration,
      tax: data.tax,
      color: data.color,
      price: data.price,
      category_id: data.category_id,
      commission: data.commission,
      type: data.type,
      stock: Number(data.stock),
      brand_id: data.brand_id,
      sku: data.sku,
      ProductPreference: {
        on_top: data.on_top,
      },
    };
    try {
      // Post the data
      const response = await fetch(`/api/salonapp/services`, {
        method: currentService ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        toast.error(
          currentService
            ? `${t('general.update_failed')}:${responseData.message}`
            : `${t('general.create_failed')}:${responseData.message}`
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        toast.success(currentService ? t('general.update_success') : t('general.create_success'));

        mutate(`/api/salonapp/services/${currentService?.id}`);
        // Service listing again
        router.push(paths.dashboard.services.list);
      }
    } catch (error) {
      toast.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="type"
                label={t('general.product_type')}
                InputLabelProps={{ shrink: true }}
              >
                <option key={0}>{t('general.dropdown_select')}</option>
                <option key={1} value={1}>
                  Services
                </option>
                <option key={2} value={2}>
                  Retails
                </option>
              </RHFSelect>

              <RHFTextField
                name="name"
                label={t('salonapp.service.name')}
                helperText={t('salonapp.service.sn_helper')}
              />

              <RHFSelect
                native
                name="category_id"
                label={t('general.category')}
                InputLabelProps={{ shrink: true }}
              >
                <option key={0}>{t('general.dropdown_select')}</option>
                {servicecategory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField
                name="duration"
                label={t('salonapp.service.duration_in_min')}
                helperText={t('salonapp.service.dim_helper')}
              />
              <RHFTextField
                name="type"
                label={t('general.product_type')}
                style={{ display: 'none' }}
              />
              <RHFTextField name="price" label={t('salonapp.price_exclusive_tax')} />
              <RHFTextField name="tax" label={t('tax')} helperText={t('salonapp.tax_helper')} />
              <RHFTextField
                name="commission"
                label={t('commission')}
                helperText={t('salonapp.service.commission_helper')}
              />
              <MuiColorInput
                name="color"
                label="Color"
                format="hex"
                value={color}
                onChange={handleChange}
                helperText={t('salonapp.service.color_helper')}
              />

              {Number(type) === 2 && (
                <>
                  <RHFSelect
                    native
                    name="brand_id"
                    label={t('general.retail_brand')}
                    InputLabelProps={{ shrink: true }}
                  >
                    <option key={0}>{t('general.dropdown_select')}</option>
                    {retailbrands.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFTextField
                    name="sku"
                    label={t('sku')}
                    helperText={t('salonapp.service.sku_helper')}
                  />
                  <RHFTextField
                    name="stock"
                    label={t('stock')}
                    helperText={t('salonapp.service.stock_helper')}
                  />
                </>
              )}

              {Number(type) !== 2 && (
                <RHFSwitch
                  name="on_top"
                  label={t('salonapp.service.on_the_top')}
                  helperText={t('salonapp.service.onthetop_helper')}
                />
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentService
                  ? t('salonapp.service.create_service')
                  : t('salonapp.service.save_service')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
