import { type StackProps } from '@mui/material/Stack'
import { type Theme, type SxProps } from '@mui/material/styles'
import { type ListItemButtonProps } from '@mui/material/ListItemButton'

// ----------------------------------------------------------------------

export interface SlotProps {
  gap?: number
  rootItem?: SxProps<Theme>
  subItem?: SxProps<Theme>
  subheader?: SxProps<Theme>
  currentRole?: string
}

export interface NavItemStateProps {
  depth?: number
  open?: boolean
  active?: boolean
  hasChild?: boolean
  currentRole?: string
  externalLink?: boolean
}

export interface NavItemBaseProps {
  title: string
  path: string
  icon?: React.ReactElement
  info?: React.ReactElement
  caption?: string
  disabled?: boolean
  roles?: string[]
  children?: any
}

export type NavItemProps = ListItemButtonProps &
NavItemStateProps &
NavItemBaseProps & {
  slotProps?: SlotProps
}

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

export interface NavGroupProps {
  subheader?: string
  items: NavItemBaseProps[]
  slotProps?: SlotProps
}

export type NavProps = StackProps & {
  data: Array<{
    subheader: string
    items: NavItemBaseProps[]
  }>
  slotProps?: SlotProps
}
