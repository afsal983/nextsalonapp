
export type ReportFilterValue = string | string[]

export interface IReportItem {
    id: string
    name: string
    url: string
  }

  export interface ReportFilters {
    name: string[]
  }
  