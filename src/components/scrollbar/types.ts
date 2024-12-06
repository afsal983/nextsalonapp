import type { Props as SimplebarProps } from 'simplebar-react';

import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ScrollbarProps = SimplebarProps & {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  fillContent?: boolean;
  slotProps?: {
    wrapper?: SxProps<Theme>;
    contentWrapper?: SxProps<Theme>;
    content?: Partial<SxProps<Theme>>;
  };
};
