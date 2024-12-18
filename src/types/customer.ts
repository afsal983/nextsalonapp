// ----------------------------------------------------------------------

export type CustomerTableFilterValue = string | string[];
export type CustomerCategoryTableFilterValue = string | string[];

export interface CustomerTableFilters {
  name: string;
  customercategory: string[];
  status: string;
}

export interface CustomerCategoryTableFilters {
  name: string;
  status: string;
}

// ----------------------------------------------------------------------

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  comment: string;
  address: string;
  telephone: string;
  email: string;
  sex: string;
  dob: string | null;
  deleted: number;
  category_id: number;
  taxid: string;
  cardno: string;
  CustomerCategory: CustomerCategory;
  CustomerPreference: {
    customer_id: number;
    eventnotify: boolean;
    promonotify: boolean;
    dummy: boolean;
  };
}

export interface CustomerCategory {
  id: string;
  name: string;
  discount: number;
  default_category: boolean;
}
