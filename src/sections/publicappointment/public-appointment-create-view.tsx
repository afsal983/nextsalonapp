






import { EmployeeItem } from "src/types/employee";
import { type ServiceCategoryItem } from "src/types/service";

// ----------------------------------------------------------------------

interface Props {
  serviceCategory?: ServiceCategoryItem[];
  employees: EmployeeItem[];
}

export default function ServiceNewEditForm({
  serviceCategory,
  employees,
}: Props) {
  // const router = useRouter();
  return <></>;
}
