import { type LocationItem } from 'src/types/location';
import { type OrganizationItem } from 'src/types/organization';
// ----------------------------------------------------------------------

export type BranchTableFilterValue = string | string[];

export interface BranchTableFilters {
  name: string;
  status: string;
}

// ----------------------------------------------------------------------

export interface BranchItem {
  branch_id: number;
  name: string;
  reg_name: string;
  address: string;
  telephone: string;
  taxid: string;
  org_id: number;
  loc_id: number;
  Organization: OrganizationItem;
  Location: LocationItem;
}

export interface ServiceCategoryItem {
  id: string;
  name: string;
  type: number;
}
