import { type StackProps } from '@mui/material/Stack'
import { type Theme, type SxProps } from '@mui/material/styles'
import { type ListItemButtonProps } from '@mui/material/ListItemButton'

// ----------------------------------------------------------------------

export interface SlotProps {
  rootItem?: SxProps<Theme>
  subItem?: SxProps<Theme>
  subheader?: SxProps<Theme>
  displayProduct?: number
}

export interface NavProducts {
  name: string
  path: string
  coverUrl: string
}

export interface NavLink {
  title: string
  path: string
}

export interface NavItemStateProps {
  open?: boolean
  active?: boolean
  hasChild?: boolean
  externalLink?: boolean
}

export interface NavItemBaseProps {
  title: string
  path: string
  icon?: React.ReactElement
  tags?: NavLink[]
  moreLink?: NavLink
  products?: NavProducts[]
  children?: Array<{
    subheader: string
    items: Array<{
      title: string
      path: string
    }>
  }>
}

export type NavItemProps = ListItemButtonProps &
NavItemBaseProps &
NavItemStateProps

export interface NavListProps {
  data: NavItemBaseProps
  slotProps?: SlotProps
}

export type NavSubListProps = StackProps & {
  data: Array<{
    subheader: string
    items: Array<{
      title: string
      path: string
    }>
  }>
  slotProps?: SlotProps
  title?: string
  onCloseMenu?: VoidFunction
}

export type NavProps = StackProps & {
  data: NavItemBaseProps[]
  slotProps?: SlotProps
}
