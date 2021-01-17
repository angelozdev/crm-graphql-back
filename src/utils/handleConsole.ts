import { Errors } from 'types'
import { green, red } from 'colors'

export function handleError(messageError: Errors): never {
  const error = new Error(messageError)

  console.error(red(error.message.toUpperCase()))
  console.error(error)
  throw error
}

export function handleSuccess(message: string, data: any): void {
  console.log(green(message.toUpperCase()))
  console.log(data)
}
