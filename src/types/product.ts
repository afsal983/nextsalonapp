// ----------------------------------------------------------------------

export type IProductFilterValue = string | string[] | number | number[]

export interface IProductFilters {
  rating: string
  gender: string[]
  category: string
  colors: string[]
  priceRange: number[]
  name: string
}

// ----------------------------------------------------------------------

export interface IProductReviewNewForm {
  rating: number | null
  review: string
  name: string
  email: string
}

export interface IProductReview {
  id: string
  name: string
  rating: number
  comment: string
  helpful: number
  avatarUrl: string
  isPurchased: boolean
  attachments?: string[]
  postedAt: Date
}

export interface IProductItem {
  id: string
  sku: string
  name: string
  code: string
  price: number
  taxes: number
  tags: string[]
  gender: string
  sizes: string[]
  publish: string
  coverUrl: string
  images: string[]
  colors: string[]
  quantity: number
  category: string
  available: number
  totalSold: number
  description: string
  totalRatings: number
  totalReviews: number
  inventoryType: string
  subDescription: string
  priceSale: number | null
  reviews: IProductReview[]
  createdAt: Date
  ratings: Array<{
    name: string
    starCount: number
    reviewCount: number
  }>
  saleLabel: {
    enabled: boolean
    content: string
  }
  newLabel: {
    enabled: boolean
    content: string
  }
}

export type IProductTableFilterValue = string | string[]

export interface IProductTableFilters {
  stock: string[]
  publish: string[]
}
