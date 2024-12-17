import { mutate } from 'swr';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { MuiColorInput } from 'mui-color-input';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, RHFSwitch, Field, RHFTextField, schemaHelper } from 'src/components/hook-form';

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
  duration: schemaHelper.nullableInput(
    zod.number({ coerce: true }).min(1, { message: 'Duration is required!' }),
    {
      // message for null value
      message: 'Duration is required!',
    }
  ),

  tax: zod.number({ coerce: true }).nullable(),
  color: zod.string().min(1, { message: 'general.color_fvalid_error' }),
  price: schemaHelper.nullableInput(
    zod.number({ coerce: true }).min(1, { message: 'Price is required!' }),
    {
      // message for null value1
      message: 'Price is required!',
    }
  ),

  category_id: zod
    .number()
    .positive({ message: 'general.must_be_non_zero' })
    .refine((val) => val !== undefined, { message: 'general.category_fvalid_error' }),
  brand_id: zod.number().optional(),
  sku: zod.string().optional(),
  stock: zod.number().optional(),
  commission: zod.number({ coerce: true }).nullable(),
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
      commission: currentService?.commission || 0,
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
      toast.error('Error');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
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
              <Field.Select name="type" label={t('general.product_type')}>
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem key={1} value={1}>
                  Services
                </MenuItem>
                <MenuItem key={2} value={2}>
                  Retails
                </MenuItem>
              </Field.Select>

              <RHFTextField
                name="name"
                label={t('salonapp.service.name')}
                helperText={t('salonapp.service.sn_helper')}
              />

              <Field.Select name="category_id" label={t('general.category')}>
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {servicecategory.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Field.Select>

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
              <RHFTextField name="price" type="number" label={t('salonapp.price_exclusive_tax')} />
              <RHFTextField
                name="tax"
                type="number"
                label={t('tax')}
                helperText={t('salonapp.tax_helper')}
              />

              <RHFTextField
                name="commission"
                type="number"
                placeholder="0.00"
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
                  <Field.Select name="brand_id" label={t('general.retail_brand')}>
                    <MenuItem value="">None</MenuItem>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    {retailbrands.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Field.Select>

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
