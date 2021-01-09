import { MiddlewareFn } from 'type-graphql'
import { Payload } from 'utils/jwtMethods'

export const hasToken: MiddlewareFn<{ user: Payload }> = (
  { context },
  next
) => {
  if (!context.user) throw new Error('Token invalid')

  return next()
}
