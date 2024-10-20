
export type ReportFilterValue = string | string[] | Date | null


export type SalesReportTableFilterValue = string | string[] | Date | null | undefined

export interface SalesReportTableFilters {
  name: string
  status: string
  filtername: string,
  filtervalue: string,
  startDate: Date | null
  endDate: Date | null
}


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
  