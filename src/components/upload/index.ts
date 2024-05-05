import dynamic from 'next/dynamic'

export * from './types'

export { default as MultiFilePreview } from './preview-multi-file'
export { default as RejectionFiles } from './errors-rejection-files'
export { default as SingleFilePreview } from './preview-single-file'

export const Upload = dynamic(async () => import('./upload'), {
  ssr: false
})

export const UploadBox = dynamic(async () => import('./upload-box'), {
  ssr: false
})

export const UploadAvatar = dynamic(async () => import('./upload-avatar'), {
  ssr: false
})
