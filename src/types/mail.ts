// ----------------------------------------------------------------------

export interface IMailLabel {
  id: string
  type: string
  name: string
  color: string
  unreadCount?: number
}

export interface IMailSender {
  name: string
  email: string
  avatarUrl: string | null
}

export interface IMailAttachment {
  id: string
  name: string
  size: number
  type: string
  path: string
  preview: string
  createdAt: Date
  modifiedAt: Date
}

export interface IMail {
  id: string
  labelIds: string[]
  folder: string
  isImportant: boolean
  isStarred: boolean
  isUnread: boolean
  subject: string
  message: string
  createdAt: Date
  attachments: IMailAttachment[]
  from: IMailSender
  to: IMailSender[]
}

export interface IMails {
  byId: Record<string, IMail>
  allIds: string[]
}
