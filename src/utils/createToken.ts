import config from '../config'
import User from 'entity/User'
import jwt from 'jsonwebtoken'

function createToken(user: User, expiresIn: string | number = '24h'): string {
  const secretWord = config.jwt.secret
  if (!secretWord) {
    throw new Error('Internal server error')
  }
  const { id, email, first_name, last_name } = user

  const payload = { id, email, first_name, last_name }
  const options: jwt.SignOptions = { expiresIn }

  const token = jwt.sign(payload, secretWord, options)

  return token
}

export default createToken
