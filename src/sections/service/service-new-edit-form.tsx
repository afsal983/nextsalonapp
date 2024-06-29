import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useMemo, useState } from 'react'
import { MuiColorInput } from 'mui-color-input'
import { yupResolver } from '@hookform/resolvers/yup'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import LoadingButton from '@mui/lab/LoadingButton'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField
} from 'src/components/hook-form'

import { type ServiceItem, type ServiceCategoryItem } from 'src/types/service'

// ----------------------------------------------------------------------

interface Props {
  currentService?: ServiceItem
  servicecategory: ServiceCategoryItem[]
}

export default function ServiceNewEditForm ({ currentService, servicecategory }: Props) {
  const router = useRouter()

  const [color, setColor] = useState(currentService?.color||"#FFFFFF")

  const { enqueueSnackbar } = useSnackbar()

  const { t } = useTranslate();

  const NewProductSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required(t('salonapp.service.name_fvalid_error')),
    duration: Yup.number().positive(t('general.must_be_non_zero')).required(t('salonapp.service.duration_fvalid_error')),
    tax: Yup.number().required(t('general.tax_fvalid_error')),
    color: Yup.string().required(t('general.color_fvalid_error')),
    price: Yup.number().positive(t('general.must_be_non_zero')).required(t('general.price_fvalid_error')),
    category_id: Yup.number().positive(t('general.must_be_non_zero')).required(t('general.category_fvalid_error')),
    commission: Yup.number(),
    type: Yup.number(),
    on_top: Yup.boolean()
  })

  const defaultValues = useMemo(
    () => ({
      id: currentService?.id || "0",
      name: currentService?.name || '',
      duration: currentService?.duration || 30,
      tax: currentService?.tax || 0,
      color: currentService?.color || '#ffffff',
      price: currentService?.price || 0.00,
      category_id: currentService?.category_id || 0,
      commission: currentService?.commission,
      type: currentService?.type||1,
      on_top: currentService?.ProductPreference.on_top || false
    }),
    [currentService]
  )

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues
  })

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const values = watch()

  const handleChange = (newcolor: string) => {
    setValue("color", newcolor)
  }

  const onSubmit = handleSubmit(async (data) => {
    const productData = {
      id: Number(data.id),
      name : data.name,
      duration: data.duration,
      tax: data.tax,
      color: data.color,
      price: data.price,
      category_id: data.category_id,
      commission: data.commission,
      type: data.type,
      ProductPreference: {
        on_top: data.on_top
      }
    }
    try {
      
      // Post the data 
      const response = await fetch(`/api/salonapp/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if(responseData?.status > 401 ) {
        enqueueSnackbar(currentService ? t('general.update_failed') : t('general.create_failed'), { variant: 'error' });
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset(); 
        enqueueSnackbar(currentService ? t('general.update_success') : t('general.create_success'), { variant: 'success' });

        // Service listing again
        router.push(paths.dashboard.services.list)
      }
    } catch (error) {
        enqueueSnackbar(error, { variant: 'error' });
    }
  })

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)'
              }}
            >
              <RHFTextField name="name" label={t('salonapp.service.service_name')} helperText={t('salonapp.service.sn_helper')}/>

              <RHFSelect native name="category_id" label={t('general.category')} InputLabelProps={{ shrink: true }}>
                <option key={0}>{ t('general.dropdown_select') }</option>
                {servicecategory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="duration" label={t('salonapp.service.duration_in_min')} helperText= {t('salonapp.service.dim_helper')}/>
              <RHFTextField name="type" label={t('general.product_type')} style={{ display: "none" }}/>
              <RHFTextField name="price" label={t('salonapp.price_exclusive_tax')} />
              <RHFTextField name="tax" label={t('tax')} helperText={t('salonapp.tax_helper')}/>
              <RHFTextField name="commission" label={t('commission')} helperText={t('salonapp.service.commission_helper')}/>
              <MuiColorInput
                name="color"
                label="Color"
                format="hex"
                value={color}
                onChange={handleChange}
                helperText={t('salonapp.service.color_helper')}
              />
              <RHFSwitch name="on_top" label={t('salonapp.service.on_the_top')} helperText={t('salonapp.service.onthetop_helper')}/>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentService ? t('salonapp.service.create_service') : t('salonapp.service.save_service')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
