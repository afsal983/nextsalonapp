// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  AUTH_DEMO: '/auth-demo',
};

// ----------------------------------------------------------------------

export const paths = {
  SMEYE: 'SMEEYE.COM',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  about: `${ROOTS.DASHBOARD}/about`,
  contact: `${ROOTS.DASHBOARD}/contact`,
  faqs: `${ROOTS.DASHBOARD}/faqs`,
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    customers: {
      root: `${ROOTS.DASHBOARD}/customer`,
      new: `${ROOTS.DASHBOARD}/customer/new`,
      list: `${ROOTS.DASHBOARD}/customer/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/customer/${id}/edit`,
      customercategory: {
        root: `${ROOTS.DASHBOARD}/customercategory`,
        new: `${ROOTS.DASHBOARD}/customercategory/new`,
        list: `${ROOTS.DASHBOARD}/customercategory/list`,
        edit: (id: number) => `${ROOTS.DASHBOARD}/customercategory/${id}/edit`,
      },
    },
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
      },
    },
    retails: {
      root: `${ROOTS.DASHBOARD}/retail`,
      new: `${ROOTS.DASHBOARD}/retail/new`,
      list: `${ROOTS.DASHBOARD}/retail/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/retail/${id}/edit`,
    },
    retailbrands: {
      root: `${ROOTS.DASHBOARD}/retailbrand`,
      new: `${ROOTS.DASHBOARD}/retailbrand/new`,
      list: `${ROOTS.DASHBOARD}/retailbrand/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/retailbrand/${id}/edit`,
    },
    packages: {
      root: `${ROOTS.DASHBOARD}/package`,
      new: `${ROOTS.DASHBOARD}/package/new`,
      list: `${ROOTS.DASHBOARD}/package/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/service/${id}/edit`,
    },
    appointments: {
      root: `${ROOTS.DASHBOARD}/appointment`,
      list: `${ROOTS.DASHBOARD}/appointment/list`,
      new: `${ROOTS.DASHBOARD}/appointment/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/appointment/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/appointment/${id}/edit`,
      appointmentinvoice: (id: string) => `${ROOTS.DASHBOARD}/appointment/${id}/appointmentinvoice`,
      calander: {
        root: `${ROOTS.DASHBOARD}/appointment/calander`,
      },
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
      },
    },
    employees: {
      root: `${ROOTS.DASHBOARD}/employee`,
      new: `${ROOTS.DASHBOARD}/employee/new`,
      list: `${ROOTS.DASHBOARD}/employee/list`,
      edit: (id: number) => `${ROOTS.DASHBOARD}/employee/${id}/edit`,
      timeslots: {
        root: `${ROOTS.DASHBOARD}/timeslot`,
        new: `${ROOTS.DASHBOARD}/timeslot/new`,
        list: `${ROOTS.DASHBOARD}/timeslot/list`,
        edit: (id: number) => `${ROOTS.DASHBOARD}/timeslot/${id}/edit`,
        details: (id: string) => `${ROOTS.DASHBOARD}/timeslot/${id}`,
      },
      workschedule: {
        root: `${ROOTS.DASHBOARD}/workschedule`,
      },
    },
    branches: {
      root: `${ROOTS.DASHBOARD}/branch`,
      list: `${ROOTS.DASHBOARD}/branch/list`,
      new: `${ROOTS.DASHBOARD}/branch/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/branch/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/branch/${id}/edit`,
    },
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
      list: `${ROOTS.DASHBOARD}/retail/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/report/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/report/${id}/edit`,
    },
    organization: {
      root: `${ROOTS.DASHBOARD}/organization`,
      list: `${ROOTS.DASHBOARD}/organization/list`,
      new: `${ROOTS.DASHBOARD}/organization/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/organization/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/organization/${id}/edit`,
    },
    location: {
      root: `${ROOTS.DASHBOARD}/location`,
      list: `${ROOTS.DASHBOARD}/location/list`,
      new: `${ROOTS.DASHBOARD}/location/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/location/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/location/${id}/edit`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/user/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      userrole: {
        root: `${ROOTS.DASHBOARD}/userrole`,
        edit: `${ROOTS.DASHBOARD}/userrole/edit`,
      },
    },
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
    },
  },
};
