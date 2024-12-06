import { m } from 'framer-motion';
import { forwardRef } from 'react';
import type { MotionProps } from 'framer-motion';

import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

import { varContainer } from './variants';

// ----------------------------------------------------------------------

export type MotionContainerProps = BoxProps &
  MotionProps & {
    animate?: boolean;
    action?: boolean;
  };

export const MotionContainer = forwardRef<HTMLDivElement, MotionContainerProps>(
  ({ animate, action = false, children, ...other }, ref) => {
    /* eslint-disable no-nested-ternary */
    const commonProps = {
      ref,
      component: m.div,
      variants: varContainer(),
      initial: action ? false : 'initial',
      animate: action ? (animate ? 'animate' : 'exit') : 'animate',
      exit: action ? undefined : 'exit',
      ...other,
    };
    /* eslint-enable no-nested-ternary */
    return <Box {...commonProps}>{children}</Box>;
  }
);
