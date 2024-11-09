import * as Yup from "yup";
import { mutate } from "swr";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import { useTranslate } from "src/locales";

import FormProvider from "src/components/hook-form";
import { useSnackbar } from "src/components/snackbar";

import { BranchItem } from "src/types/branch";
import { ServiceItem } from "src/types/service";
import { AppSettings } from "src/types/settings";
import { EmployeeItem } from "src/types/employee";
import { IPaymenttypes } from "src/types/payment";
import {
  Retails,
  IInvoice,
  Products,
  Packages,
  Payments,
} from "src/types/invoice";

import InvoiceNewEditDetails from "./invoice-new-edit-details";
import InvoiceNewEditAddress from "./invoice-new-edit-address";
import InvoiceNewEditStatusDate from "./invoice-new-edit-status-date";

// ----------------------------------------------------------------------

type Props = {
  currentInvoice?: IInvoice;
  services?: ServiceItem[];
  branches: BranchItem[];
  employees: EmployeeItem[];
  appsettings: AppSettings[];
  paymenttypes: IPaymenttypes[];
};

export default function InvoiceNewEditForm({
  currentInvoice,
  services,
  branches,
  employees,
  appsettings,
  paymenttypes,
}: Props) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  // Same as database structure
  const InvoiceSchema = Yup.object().shape({
    id: Yup.string(),
    invoicenumber: Yup.string(),
    date: Yup.mixed<any>().required("Date is required"),
    dueDate: Yup.mixed<any>(),
    total: Yup.number(),
    discount: Yup.number(),
    tax_rate: Yup.number(),
    tip: Yup.number(),
    customer_id: Yup.number()
      .required("Customer required")
      .positive("Customer required"),
    Customer: Yup.mixed<any>(),
    event_id: Yup.number(),
    Event: Yup.mixed<any>(),
    Invoice_line: Yup.lazy(() =>
      Yup.array()
        .of(
          Yup.object({
            id: Yup.number(),
            quantity: Yup.number()
              .required("Quantity is required")
              .min(1, "Quantity must be more than 0"),
            price: Yup.number()
              .positive("Discount must be a positive value")
              .required("Price is required"),
            discount: Yup.number().min(0, "Discount cannot be negative"),
            invoice_id: Yup.number(),
            product_id: Yup.number().required("Product is required"),
            Product: Yup.mixed<any>(),
            employee_id: Yup.number().required("Employee is required"),
            Employee: Yup.mixed<any>(),
            branch_id: Yup.number(),
            Branches_organization: Yup.mixed<any>(),
            deleted: Yup.number(),
          })
        )
        .test({
          message: "Atleast One item Required",
          test: (arr) => arr && arr.length > 0,
        })
    ),
    branch_id: Yup.number()
      .required("Branch required")
      .positive("Brach required"),
    Branches_organization: Yup.mixed<any>(),
    status: Yup.number().required("Status required"),
    Invstatus: Yup.mixed<any>(),
    deleted: Yup.number(),
    Payment: Yup.lazy(() =>
      Yup.array()
        .of(
          Yup.object({
            id: Yup.number(),
            invoice_id: Yup.number(),
            value: Yup.number()
              .required("Payment amount is required")
              .positive("Payment value must be a positive value"),
            payment_type: Yup.number().required("Payment amount is required"),
            auth_code: Yup.string(),
          })
        )
        .test({
          message: "Atleast One Payment Required",
          test: (arr) => arr && arr.length > 0,
        })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentInvoice?.id || "",
      invoicenumber: currentInvoice?.invoicenumber || "",
      date:
        (currentInvoice?.date && new Date(currentInvoice?.date)) || new Date(),
      total: currentInvoice?.total || 0,
      dueDate: new Date(),
      discount: currentInvoice?.discount || 0,
      tax_rate: currentInvoice?.tax_rate || 0,
      tip: currentInvoice?.tip || 0,
      customer_id: currentInvoice?.customer_id || 0,
      Customer: currentInvoice?.Customer || {},
      event_id: currentInvoice?.event_id || 0,
      Event: currentInvoice?.Event || {},
      Invoice_line: currentInvoice?.Invoice_line || [],
      branch_id: currentInvoice?.branch_id || 0,
      Branches_organization: currentInvoice?.Branches_organization || {},
      status: currentInvoice?.status || 1,
      Invstatus: currentInvoice?.Invstatus || {},
      deleted: currentInvoice?.deleted || 0,
      Payment: currentInvoice?.Payment || [],
    }),
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(InvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /*
  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.invoice.root);
      // console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      loadingSave.onFalse();
    }
  });
  */

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    console.log(data);

    const products: Products[] = [];
    const retails: Retails[] = [];
    const packages: Packages[] = [];
    const payments: Payments[] = [];
    data?.Invoice_line?.forEach((item) => {
      if (item.Product.type === 1) {
        const tmp = {
          id: item.id,
          start: new Date(),
          end: new Date(),
          productid: item.product_id,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee_id,
          deleted: item?.deleted,
        };
        products.push(tmp);
      } else if (item.Product.type === 2) {
        const tmp = {
          id: item.id,
          productid: item.product_id,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee_id,
          deleted: item.deleted,
        };
        retails.push(tmp);
      } else if (item.Product.type === 3) {
        const tmp = {
          id: item.id,
          start: new Date(),
          end: new Date(),
          productid: item.product_id,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee_id,
          deleted: item.deleted,
        };
        packages.push(tmp);
      }
    });

    data?.Payment?.forEach((item) => {
      if (item?.value && item?.value > 0) {
        const tmp = {
          id: item.id,
          invoice_id: 0,
          value: item.value,
          payment_type: item.payment_type,
          auth_code: item.auth_code,
        };
        payments.push(tmp);
      }
    });

    const invoicedata = {
      id: currentInvoice?.id || 0,
      customer: data.customer_id,
      branch_id: data.branch_id,
      reminder_count: 0,
      products,
      retails,
      packages,
      payments,
      discount: data.discount,
      tip: data.tip,
      paymentmethod: 1,
      notify: 0,
      createevent: 1,
      event_id: 0,
    };

    try {
      // Post the data
      const response = await fetch(`/api/salonapp/invoice`, {
        method: currentInvoice ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoicedata),
      });

      const responseData = await response.json();

      if (responseData?.status > 401) {
        enqueueSnackbar(
          currentInvoice ? responseData?.message : responseData?.message,
          { variant: "error" }
        );
      } else {
        // Keep 500ms delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        reset();
        enqueueSnackbar(
          currentInvoice
            ? t("general.update_success")
            : t("general.create_success"),
          { variant: "success" }
        );

        mutate(`/api/salonapp/invoice/${currentInvoice?.id}`);
        // Invoice data after creation
        router.push(paths.dashboard.invoice.details(responseData.data[0].id));
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  });

  return (
    <FormProvider methods={methods}>
      <Card>
        <InvoiceNewEditAddress branches={branches} />

        <InvoiceNewEditStatusDate />

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <InvoiceNewEditDetails
              services={services}
              employees={employees}
              appsettings={appsettings}
              currentInvoice={currentInvoice}
              paymenttypes={paymenttypes}
              branches={branches}
            />
          </Grid>
        </Grid>
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        {/*
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton>
      */}

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentInvoice ? "Update" : "Create"} & Send
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
