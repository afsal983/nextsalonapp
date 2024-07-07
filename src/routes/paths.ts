// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard'
}

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`
    }
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    services: {
      root: `${ROOTS.DASHBOARD}/service`,
      new: `${ROOTS.DASHBOARD}/service/new`,
      list: `${ROOTS.DASHBOARD}/service/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/service/${id}/edit`,
      servicecategory: {
        root: `${ROOTS.DASHBOARD}/servicecategory`,
        new: `${ROOTS.DASHBOARD}/servicecategory/new`,
        list: `${ROOTS.DASHBOARD}/servicecategory/list`,
        edit: (id: number) => `${ROOTS.DASHBOARD}/servicecategory/${id}/edit`,
      }
    },
    retails: {
      root: `${ROOTS.DASHBOARD}/retail`,
      new: `${ROOTS.DASHBOARD}/retail/new`,
      list: `${ROOTS.DASHBOARD}/retail/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/retail/${id}/edit`
    },
    retailbrands: {
      root: `${ROOTS.DASHBOARD}/retailbrand`,
      new: `${ROOTS.DASHBOARD}/retailbrand/new`,
      list: `${ROOTS.DASHBOARD}/retailbrand/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/retailbrand/${id}/edit`
    },
    packages: {
      root: `${ROOTS.DASHBOARD}/package`,
      new: `${ROOTS.DASHBOARD}/package/new`,
      list: `${ROOTS.DASHBOARD}/package/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/service/${id}/edit`
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      list: `${ROOTS.DASHBOARD}/invoice/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      paymenttypes: {
        root: `${ROOTS.DASHBOARD}/paymenttype`,
        new: `${ROOTS.DASHBOARD}/paymenttype/new`,
        list: `${ROOTS.DASHBOARD}/paymenttype/list`,
        edit: (id: number) => `${ROOTS.DASHBOARD}/paymenttype/${id}/edit`,
        details: (id: string) => `${ROOTS.DASHBOARD}/paymenttype/${id}`,
      }
    },
    employees: {
      root: `${ROOTS.DASHBOARD}/employee`,
      new: `${ROOTS.DASHBOARD}/employee/new`,
      list: `${ROOTS.DASHBOARD}/employee/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/employee/${id}/edit`,
    },
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
      list: `${ROOTS.DASHBOARD}/retail/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/report/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/report/${id}/edit`,

    },
  }
}
