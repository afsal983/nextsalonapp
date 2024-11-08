import * as Yup from "yup";
import { mutate } from "swr";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { MuiColorInput } from "mui-color-input";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useTranslate } from "src/locales";

import { useSnackbar } from "src/components/snackbar";
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";

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
