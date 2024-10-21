import * as Yup from "yup";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
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

import PaymentNewEditForm from "./payment-new-edit-form";
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

  const NewInvoiceSchema = Yup.object().shape({
    invoiceTo: Yup.mixed<any>().nullable().required("Invoice to is required"),
    createDate: Yup.mixed<any>().nullable().required("Create date is required"),
    dueDate: Yup.mixed<any>().required("Due date is required"),
    // .test(
    //  'date-min',
    //  'Due date must be later than create date',
    //  (value, { parent }) => value.getTime() > parent.createDate.getTime()
    // ),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          id: Yup.number(),
          service: Yup.number()
            .positive("Choose a service")
            .required("Service is required"),
          employee: Yup.number()
            .positive("Choose an employee")
            .required("Employee is required"),
          quantity: Yup.number()
            .required("Quantity is required")
            .min(1, "Quantity must be more than 0"),
          price: Yup.number()
            .positive("Discount must be a positive value")
            .required("Service is required"),
          discount: Yup.number().min(0, "Discount cannot be negative"),
          total: Yup.number().positive("Discount must be a positive value"),
          type: Yup.number(),
        })
      )
    ),
    payments: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          id: Yup.number(),
          invoice_id: Yup.number(),
          value: Yup.number(),
          payment_type: Yup.number(),
          auth_code: Yup.string(),
        })
      )
    ),
    // not required
    taxes: Yup.number(),
    status: Yup.string(),
    discount: Yup.number(),
    tip: Yup.number(),
    invoiceFrom: Yup.mixed(),
    totalAmount: Yup.number(),
    invoiceNumber: Yup.string(),
  });

  // Wrap the initialization of currentitems in useMemo()
  let currentitems = useMemo(
    () => [
      {
        id: 0,
        service: 0,
        employee: 0,
        quantity: 1,
        price: 0,
        discount: 0,
        total: 0,
        type: 0,
      },
    ],
    []
  );

  if (currentInvoice?.Invoice_line) {
    currentitems = [];
    currentInvoice?.Invoice_line.map((item) => {
      const tmp = {
        id: item.id,
        service: item.Product.id,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
        discount: item.discount,
        employee: item.Employee.id,
        type: item.Product.type,
      };
      currentitems.push(tmp);
      return tmp;
    });
  }

  const defaultValues = useMemo(
    () => ({
      invoiceTo: currentInvoice?.Customer || null,
      createDate:
        (currentInvoice?.date && new Date(currentInvoice?.date)) || new Date(),
      dueDate:
        (currentInvoice?.date && new Date(currentInvoice?.date)) || new Date(),
      items: currentitems,
      payments: currentInvoice?.Payment || [
        {
          id: 0,
          invoice_id: 0,
          value: 0,
          payment_type: 0,
          auth_code: "",
        },
      ],
      taxes: currentInvoice?.tax_rate || 0,
      status: "paid",
      discount: currentInvoice?.discount || 0,
      tip: currentInvoice?.tip || 0,
      invoiceFrom: currentInvoice?.Branches_organization || branches[0],
      totalAmount: currentInvoice?.total || 0,
      invoiceNumber: currentInvoice?.invoicenumber || "INV-1990",
    }),
    [currentInvoice, branches, currentitems]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();
    console.log(data);

    const products: Products[] = [];
    const retails: Retails[] = [];
    const packages: Packages[] = [];
    const payments: Payments[] = [];
    data?.items?.forEach((item) => {
      if (item.type === 1) {
        const tmp = {
          id: item.id,
          start: new Date(),
          end: new Date(),
          productid: item.service,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee,
          deleted: 0,
        };
        products.push(tmp);
      } else if (item.type === 2) {
        const tmp = {
          id: item.id,
          productid: item.service,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee,
          deleted: 0,
        };
        retails.push(tmp);
      } else if (item.type === 3) {
        const tmp = {
          id: item.id,
          start: new Date(),
          end: new Date(),
          productid: item.service,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          employeeid: item.employee,
          deleted: 0,
        };
        packages.push(tmp);
      }
    });

    data?.payments?.forEach((item) => {
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
      customer: data.invoiceTo.id,
      branch_id: data.invoiceFrom.branch_id,
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

        // Service listing again
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

        <InvoiceNewEditDetails
          services={services}
          employees={employees}
          appsettings={appsettings}
          currentInvoice={currentInvoice}
          branches={branches}
        />

        <PaymentNewEditForm paymenttypes={paymenttypes} />
      </Card>

      <Stack
        justifyContent="flex-end"
        direction="row"
        spacing={2}
        sx={{ mt: 3 }}
      >
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </LoadingButton>

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
