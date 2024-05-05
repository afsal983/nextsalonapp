// ----------------------------------------------------------------------

export type IFileFilterValue = string | string[] | Date | null

export interface IFileFilters {
  name: string
  type: string[]
  startDate: Date | null
  endDate: Date | null
}

// ----------------------------------------------------------------------

export interface IFileShared {
  id: string
  name: string
  email: string
  avatarUrl: string
  permission: string
}

export interface IFolderManager {
  id: string
  name: string
  size: number
  type: string
  url: string
  tags: string[]
  totalFiles?: number
  isFavorited: boolean
  shared: IFileShared[] | null
  createdAt: Date | number | string
  modifiedAt: Date | number | string
}

export interface IFileManager {
  id: string
  name: string
  size: number
  type: string
  url: string
  tags: string[]
  isFavorited: boolean
  shared: IFileShared[] | null
  createdAt: Date | number | string
  modifiedAt: Date | number | string
}

export type IFile = IFileManager | IFolderManager
