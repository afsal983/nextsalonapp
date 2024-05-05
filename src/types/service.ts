import { type CustomFile } from 'src/components/upload'

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[]

export interface IUserTableFilters {
  name: string
  productcategory: string[]
  status: string
}

// ----------------------------------------------------------------------

export interface ServiceItem {
  id: string
  name: string
  category: number
  duration: number
  price: number
  tax: number
  commission: number
  color: string
  onthetop: boolean
}

export interface ServiceCategoryItem {
  id: string
  name: string
  type: number
}

export interface IUserSocialLink {
  facebook: string
  instagram: string
  linkedin: string
  twitter: string
}

export interface IUserProfileCover {
  name: string
  role: string
  coverUrl: string
  avatarUrl: string
}

export interface IUserProfile {
  id: string
  role: string
  quote: string
  email: string
  school: string
  country: string
  company: string
  totalFollowers: number
  totalFollowing: number
  socialLinks: IUserSocialLink
}

export interface IUserProfileFollower {
  id: string
  name: string
  country: string
  avatarUrl: string
}

export interface IUserProfileGallery {
  id: string
  title: string
  imageUrl: string
  postedAt: Date
}

export interface IUserProfileFriend {
  id: string
  name: string
  role: string
  avatarUrl: string
}

export interface IUserProfilePost {
  id: string
  media: string
  message: string
  createdAt: Date
  personLikes: Array<{
    name: string
    avatarUrl: string
  }>
  comments: Array<{
    id: string
    message: string
    createdAt: Date
    author: {
      id: string
      name: string
      avatarUrl: string
    }
  }>
}

export interface IUserCard {
  id: string
  name: string
  role: string
  coverUrl: string
  avatarUrl: string
  totalPosts: number
  totalFollowers: number
  totalFollowing: number
}

export interface IServiceItem {
  id: string
  name: string
  price: number
  tax: number
  duration: number
  commission: number
  color: string
  ProductCategory: {
    name: string
  }
  status: string
  category: number
  onthetop: boolean
}

export interface IServiceCategoryItem {
  id: string
  name: string
  type: number
}

export interface IUserAccount {
  email: string
  isPublic: boolean
  displayName: string
  city: string | null
  state: string | null
  about: string | null
  country: string | null
  address: string | null
  zipCode: string | null
  phoneNumber: string | null
  photoURL: CustomFile | string | null
}

export interface IUserAccountBillingHistory {
  id: string
  price: number
  createdAt: Date
  invoiceNumber: string
}

export interface IUserAccountChangePassword {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}
