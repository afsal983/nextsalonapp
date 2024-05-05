import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { type Theme, type SxProps } from '@mui/material/styles'
import TablePagination, {
  type TablePaginationProps
} from '@mui/material/TablePagination'

// ----------------------------------------------------------------------

interface Props {
  dense?: boolean
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void
  sx?: SxProps<Theme>
}

export default function TablePaginationCustom ({
  dense,
  onChangeDense,
  rowsPerPageOptions = [5, 10, 25],
  sx,
  ...other
}: Props & TablePaginationProps) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{
          borderTopColor: 'transparent'
        }}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute'
            }
          }}
        />
      )}
    </Box>
  )
}
