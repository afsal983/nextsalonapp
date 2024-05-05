// ----------------------------------------------------------------------

export interface IChatAttachment {
  name: string
  size: number
  type: string
  path: string
  preview: string
  createdAt: Date
  modifiedAt: Date
}

export interface IChatMessage {
  id: string
  body: string
  createdAt: Date
  senderId: string
  contentType: string
  attachments: IChatAttachment[]
}

export interface IChatParticipant {
  id: string
  name: string
  role: string
  email: string
  address: string
  avatarUrl: string
  phoneNumber: string
  lastActivity: Date
  status: 'online' | 'offline' | 'alway' | 'busy'
}

export interface IChatConversation {
  id: string
  type: string
  unreadCount: number
  messages: IChatMessage[]
  participants: IChatParticipant[]
}

export interface IChatConversations {
  byId: Record<string, IChatConversation>
  allIds: string[]
}
