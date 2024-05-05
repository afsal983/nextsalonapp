import dynamic from 'next/dynamic'

const OrganizationalChart = dynamic(async () => import('./organizational-chart'), {
  ssr: false
})

export * from './types'

export default OrganizationalChart
