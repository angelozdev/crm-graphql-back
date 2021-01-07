import config from '../config'
import { UserType } from '../models'
import jwt from 'jsonwebtoken'

export interface Payload {
  id: string
  email: string
  first_name: string
  last_name: string
  iat: number
  exp: number
}

export function verifyToken(token: string): Payload {
  const secretWord = config.jwt.secret
  if (!secretWord) {
    console.error('The secret word does not exist')
    throw new Error('Internal server error')
  }

  const payload = jwt.verify(token, secretWord) as Payload

  return payload
}

export function createToken(
  user: UserType,
  expiresIn: string | number = '24h'
): string {
  const secretWord = config.jwt.secret
  if (!secretWord) {
    console.error('The secret word does not exist')
    throw new Error('Internal server error')
  }
  const { id, email, first_name, last_name } = user

  const payload = { id, email, first_name, last_name }
  const options: jwt.SignOptions = { expiresIn }

  const token = jwt.sign(payload, secretWord, options)

  return token
}
