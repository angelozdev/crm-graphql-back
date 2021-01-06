import { ApolloServer } from 'apollo-server'
import db from './database'
import { buildSchema } from 'type-graphql'
import { verifyToken } from './utils/jwtMethods'

/* Resolvers */
import {
  UserResolver,
  ProductResolver,
  ClientResolver
} from './graphql/resolvers'

async function startServer() {
  await db()
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ProductResolver, ClientResolver]
    }),
    context: ({ req }) => {
      const accessToken = req.headers.authorization

      /* if (!accessToken) {
        throw new Error('Token is not valid')
      } */
      try {
        const user = verifyToken(accessToken || '')
        return { user }
      } catch (error) {
        console.error(error.message)
        return error
      }

      /* if (!user) {
        throw new Error('Token is not valid')
      } */
    }
  })

  return server
}

export default startServer
