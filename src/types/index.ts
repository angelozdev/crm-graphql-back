export enum StatusesOrder {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum Errors {
  PASSWORDS_DO_NOT_MATCH = 'passwords_do_not_match',
  USER_NOT_FOUND = 'user_not_found',
  CLIENT_ALREADY_EXISTS = 'client_already_exists',
  TOKEN_INVALID = 'token_invalid',
  CLIENT_NOT_FOUND = 'client_not_found',
  YOU_DO_NOT_HAVE_AUTHORIZATION = 'you_do_not_have_authorization',
  ORDER_NOT_FOUND = 'order_not_found',
  PRODUCT_NOT_FOUND = 'product_not_found',
  SELLER_NOT_FOUND = 'seller_not_found',
  INTERNAL_SERVER_ERROR = 'internal_server_error'
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
