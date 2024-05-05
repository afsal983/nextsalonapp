// ----------------------------------------------------------------------

export type ITourFilterValue = string | string[] | Date | ITourGuide[] | null

export interface ITourFilters {
  tourGuides: ITourGuide[]
  destination: string[]
  services: string[]
  startDate: Date | null
  endDate: Date | null
}

// ----------------------------------------------------------------------

export interface ITourGuide {
  id: string
  name: string
  avatarUrl: string
  phoneNumber: string
}

export interface ITourBooker {
  id: string
  name: string
  avatarUrl: string
  guests: number
}

export interface ITourItem {
  id: string
  name: string
  price: number
  totalViews: number
  tags: string[]
  content: string
  publish: string
  images: string[]
  durations: string
  priceSale: number
  services: string[]
  destination: string
  ratingNumber: number
  bookers: ITourBooker[]
  tourGuides: ITourGuide[]
  createdAt: Date
  available: {
    startDate: Date
    endDate: Date
  }
}
