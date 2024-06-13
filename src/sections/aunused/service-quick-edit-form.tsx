import * as Yup from 'yup'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MuiColorInput } from 'mui-color-input'
import { yupResolver } from '@hookform/resolvers/yup'

import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import LoadingButton from '@mui/lab/LoadingButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
  RHFSwitch,
  RHFTextField
} from 'src/components/hook-form'

import { type ServiceItem } from 'src/types/service'

// ----------------------------------------------------------------------

interface Props {
  open: boolean
  onClose: VoidFunction
  currentService?: ServiceItem
}

export default function ServiceQuickEditForm ({
  currentService,
  open,
  onClose
}: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const [color, setColor] = useState('#ffffff')

  const NewUserSchema = Yup.object().shape({
    id: Yup.string(),
    name: Yup.string().required('Name is required'),
    duration: Yup.number().required('Duration is required'),
    tax: Yup.number().required('Tax is required'),
    color: Yup.string().required('Country is required'),
    price: Yup.number().required('Price is required'),
    category_id: Yup.number().required('Category is required'),
    commission: Yup.number(),
    type: Yup.number(),
    on_top: Yup.boolean()
  })

  const handleChange = (newcolor: string) => {
    setColor(newcolor)
  }

  const defaultValues = useMemo(
    () => ({
      id: currentService?.id || "0",
      name: currentService?.name || '',
      duration: currentService?.duration || 15,
      tax: currentService?.tax || 0,
      color: currentService?.color || '',
      price: currentService?.price || 0,
      category_id: currentService?.category_id || 0,
      commission: currentService?.commission,
      type: currentService?.type||1,
      on_top: currentService?.ProductPreference.on_top
    }),
    [currentService]
  )

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

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
      const response = await fetch(`/api/salonapp/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if(responseData?.status > 401 ) {
        enqueueSnackbar(currentService ? 'Update Failed!' : 'Create Failed!', { variant: 'error' });
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset(); 
        enqueueSnackbar(currentService ? 'Update success!' : 'Create success!', { variant: 'success' });
        // List the items again
        router.push(paths.dashboard.services.list)
      }
    } catch (error) {
        enqueueSnackbar(error, { variant: 'error' });
    }

  })

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 }
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Quick Update</DialogTitle>

        <DialogContent>
          <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
            Some fields might be missing here. Please use vertical dots dropdown for complete fields
          </Alert>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)'
            }}
          >
            <RHFTextField
              name="name"
              label="Name"
            />
            <RHFTextField
              name="price"
              label="Price(exclusive Tax"
            />
            <RHFTextField
              name="duration"
              label="Duration in minutes"
            />
            <RHFTextField name="tax" value={defaultValues.tax} label="Tax(%)" />
            <RHFTextField
              name="commission"
              label="Commission(%)"
            />
            <MuiColorInput
              name="color"
              label="Color"
              format="hex"
              value={defaultValues.color&& color}
              onChange={handleChange}
            />
            <RHFSwitch name="on_top" label="On the top" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}
