import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { Item } from 'src/types/report';

// ----------------------------------------------------------------------

type Props = {
  report: Item;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};

export default function ReportItem({ report, onView, onEdit, onDelete }: Props) {
  const popover = usePopover();

  const { id, name } = report;

  return (
    <>
      <Card>
        <Stack sx={{ p: 3, pb: 2 }}>
          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link
                component={RouterLink}
                href={paths.dashboard.report.details(id)}
                color="inherit"
              >
                {name}
              </Link>
            }
          />
        </Stack>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
