import { type StackProps } from '@mui/material/Stack'
import { type Theme, type SxProps } from '@mui/material/styles'
import { type ListItemButtonProps } from '@mui/material/ListItemButton'

// ----------------------------------------------------------------------

export interface SlotProps {
  rootItem?: SxProps<Theme>
  subItem?: SxProps<Theme>
}

export interface NavItemStateProps {
  depth?: number
  open?: boolean
  active?: boolean
  hasChild?: boolean
  externalLink?: boolean
}

export interface NavItemBaseProps {
  title: string
  path: string
  caption?: string
  icon?: React.ReactElement
  children?: any
}

export type NavItemProps = ListItemButtonProps &
NavItemBaseProps &
NavItemStateProps

export interface NavListProps {
  data: NavItemBaseProps
  depth: number
  slotProps?: SlotProps
}

export interface NavSubListProps {
  data: NavItemBaseProps[]
  depth: number
  slotProps?: SlotProps
}

export type NavProps = StackProps & {
  data: NavItemBaseProps[]
  slotProps?: SlotProps
}
