import { MiddlewareFn } from 'type-graphql'
import { handleError } from '../../utils/handleConsole'
import { Context, Errors } from '../../types'

export const hasToken: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.user) return handleError(Errors.TOKEN_INVALID)

  return next()
}
