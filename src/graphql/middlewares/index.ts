import { MiddlewareFn } from 'type-graphql'
import { Context } from '../../types'

export const hasToken: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.user) throw new Error('Token invalid')

  return next()
}
