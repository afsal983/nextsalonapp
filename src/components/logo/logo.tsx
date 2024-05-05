import { forwardRef } from 'react'

import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import Box, { type BoxProps } from '@mui/material/Box'

import { RouterLink } from 'src/routes/components'

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean
  logourl: string
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ logourl, disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme()

    const PRIMARY_LIGHT = theme.palette.primary.light

    const PRIMARY_MAIN = theme.palette.primary.main

    const PRIMARY_DARK = theme.palette.primary.dark

    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Box
        component="img"
        src={`https://app.smeeye.com/assets/images/${  logourl}`}
        sx={{ width: 50, height: 40, cursor: 'pointer', ...sx }}
      />
    )
    
    if (disabledLink) {
      return logo
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    )
  }
)

export default Logo
