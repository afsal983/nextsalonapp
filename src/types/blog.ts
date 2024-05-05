// ----------------------------------------------------------------------

export type IPostFilterValue = string

export interface IPostFilters {
  publish: string
}

// ----------------------------------------------------------------------

export interface IPostHero {
  title: string
  coverUrl: string
  createdAt?: Date
  author?: {
    name: string
    avatarUrl: string
  }
}

export interface IPostComment {
  id: string
  name: string
  avatarUrl: string
  message: string
  postedAt: Date
  users: Array<{
    id: string
    name: string
    avatarUrl: string
  }>
  replyComment: Array<{
    id: string
    userId: string
    message: string
    postedAt: Date
    tagUser?: string
  }>
}

export interface IPostItem {
  id: string
  title: string
  tags: string[]
  publish: string
  content: string
  coverUrl: string
  metaTitle: string
  totalViews: number
  totalShares: number
  description: string
  totalComments: number
  totalFavorites: number
  metaKeywords: string[]
  metaDescription: string
  comments: IPostComment[]
  createdAt: Date
  favoritePerson: Array<{
    name: string
    avatarUrl: string
  }>
  author: {
    name: string
    avatarUrl: string
  }
}
