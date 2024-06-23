
export type ReportFilterValue = string | string[]

export interface IReportItem {
    category: string
    items: Item[]
  }

  export interface Item {
    id: string
    name: string
    url: string
  }


  export interface ReportFilters {
    name: string[]
  }
  