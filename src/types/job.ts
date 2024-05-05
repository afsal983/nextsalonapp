// ----------------------------------------------------------------------

export type IJobFilterValue = string | string[]

export interface IJobFilters {
  roles: string[]
  experience: string
  locations: string[]
  benefits: string[]
  employmentTypes: string[]
}

// ----------------------------------------------------------------------

export interface IJobCandidate {
  id: string
  name: string
  role: string
  avatarUrl: string
}

export interface IJobCompany {
  name: string
  logo: string
  phoneNumber: string
  fullAddress: string
}

export interface IJobSalary {
  type: string
  price: number
  negotiable: boolean
}

export interface IJobItem {
  id: string
  role: string
  title: string
  content: string
  publish: string
  createdAt: Date
  skills: string[]
  expiredDate: Date
  totalViews: number
  experience: string
  salary: IJobSalary
  benefits: string[]
  locations: string[]
  company: IJobCompany
  employmentTypes: string[]
  workingSchedule: string[]
  candidates: IJobCandidate[]
}
