import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import { useBoolean } from 'src/hooks/use-boolean'

import Iconify from 'src/components/iconify'
import { ConfirmDialog } from 'src/components/custom-dialog'
import CustomPopover, { usePopover } from 'src/components/custom-popover'

import { type UserItem } from 'src/types/user'

// ----------------------------------------------------------------------

interface Props {
  selected: boolean
  onEditRow: VoidFunction
  row: UserItem
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
}

export default function UserTableRow ({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow
}: Props) {
  const { name, email, address, telephone, userroledb, Branches_organization } =
    row

    console.log(row)
  const confirm = useBoolean()

  const popover = usePopover()

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={name}
            secondary={Branches_organization?.name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled'
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{address}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{telephone}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{userroledb.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{userroledb.casbin_roleid}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{Branches_organization.name}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue()
            popover.onClose()
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow()
            popover.onClose()
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  )
}
