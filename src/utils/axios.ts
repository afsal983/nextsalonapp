import axios, { type AxiosRequestConfig } from 'axios'


// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: "http://localhost:8083" })

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) =>
    Promise.reject(
      (error) || 'Something went wrong'
    )
)

export default axiosInstance

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args]
    const res = await axiosInstance.get(url, { ...config })
    return res.data
}

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/login/refreshtoken',
    login: '/api/login',
    register: '/api/auth/register'
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels'
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search'
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search'
  }
}
