export enum StatusesOrder {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Payload {
  id: string
  email: string
  first_name: string
  last_name: string
  iat: number
  exp: number
}

export type Context = { user: Payload }
