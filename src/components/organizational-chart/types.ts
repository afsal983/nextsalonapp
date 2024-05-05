import { type TreeProps } from 'react-organizational-chart'

import { type Theme, type SxProps } from '@mui/material/styles'

// ----------------------------------------------------------------------

type VariantValue = 'simple' | 'standard' | 'group'

export interface ItemProps {
  name: string
  group?: string
  role?: string | null
  avatarUrl?: string | null
  children?: any
}

export interface ListProps {
  data: ItemProps
  depth: number
  variant?: VariantValue
  sx?: SxProps<Theme>
}

export interface SubListProps {
  data: ItemProps[]
  depth: number
  variant?: VariantValue
  sx?: SxProps<Theme>
}

export type OrganizationalChartProps = Partial<TreeProps> & {
  data: {
    name: string
    children: ItemProps[]
  }
  variant?: VariantValue
  sx?: SxProps<Theme>
}
